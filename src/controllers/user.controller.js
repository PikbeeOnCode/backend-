import { asyncHandler } from "../utils/asyncHandler.js";
import{ apiError } from "../utils/apiError.js";
import {User} from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {apiResponse} from "../utils/apiResponse.js";

const createUser  = asyncHandler(async(req,res)=>{
   const {username,email,fullname,password} = req.body;
  
   if([username,email,fullname,password].some(field=>field?.trim()==="")){
       throw new apiError(400,"All fields are required");
   }

   const existedUser = await User.findOne({$or:[{username},{email}]})
   if(existedUser){
       throw new apiError(400,"Username or email already exists");
   }

   const avartarLocalpath = req.files?.avatar?.[0]?.path;
   if(!avartarLocalpath){
       throw new apiError(400,"Avatar is required");
   }
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    const avatar = await uploadOnCloudinary(avartarLocalpath);

    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;



    const  newUser = await User.create({
        username,
        email,
        fullname,
        avatar: avatar.secure_url,
        coverImage: coverImage ? coverImage.secure_url : "",
        password
    })

   const createdUser = await User.findById(newUser._id).select("-password -refreshtoken");
   if(!createdUser){
         throw new apiError(500,"Failed to create user")
   }

   return res.status(201).json(
       new apiResponse(201, createdUser, "User created successfully")
   )



})

export {
    createUser
}