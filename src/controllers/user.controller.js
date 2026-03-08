import { asyncHandler } from "../utils/asyncHandler.js";
import{ apiError } from "../utils/apiError.js";
import {User} from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {apiResponse} from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const createRefreshTokenAndAccessToken = async(userId)=>{
    try{
     const user = await User.findById(userId);
    if(!user){
        throw new apiError(404,"User not found");
    }
    const accessToken = user.generateAccesstoken();
    const refreshToken = user.generateRefreshtoken();
        user.refreshToken = refreshToken;

        // console.log("Generated tokens:", { acesstoken, refreshtoken });

    await user.save({validateBeforeSave:false});

    return { accessToken, refreshToken };

    }catch(err){
        console.log("Error generating tokens:", err);
        throw new apiError(500,"Failed to generate tokens")
        
    }
}



const createUser  = asyncHandler(async(req,res)=>{
   const {username,email,fullname,password} = req.body;
  
   if([username,email,fullname,password].some(field=>field?.trim()==="")){
       throw new apiError(400,"All fields are required");
   }

   const existedUser = await User.findOne({$or:[{username},{email}]})
   if(existedUser){
       throw new apiError(400,"Username or email already exists");
   }
   console.log("Received files:", req.files);
   const avartarLocalpath = req.files?.avatar?.[0]?.path;
   if(!avartarLocalpath){
       throw new apiError(400,"Avatar is required");
   }
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    const avatar = await uploadOnCloudinary(avartarLocalpath);
    if(!avatar){
        throw new apiError(500,"Failed to upload avatar");
    }

    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;



    const  newUser = await User.create({
        username,
        email,
        fullname,
        avatar: avatar.secure_url,
        coverImage: coverImage ? coverImage.secure_url : "",
        password
    })

   const createdUser = await User.findById(newUser._id).select("-password -refreshToken");
   if(!createdUser){
         throw new apiError(500,"Failed to create user")
   }

   return res.status(201).json(
       new apiResponse(201, createdUser, "User created successfully")
   )



})



const loginUser = asyncHandler(async(req,res)=>{
    const {username,email,password ,} = req.body;

   if(!(username && email)){
       throw new apiError(400,"Username or email is required");
   }
   if(!password){
    throw new apiError(400,"Password is required");
   }

   const user =await User.findOne({
    $or:[
        {username},
        {email}
    ]
   });

   if(!user){
    throw new apiError(404,"User not found");
   }

   const isPasswordValid = await user.isPasswordCorrect(password);

   if(!isPasswordValid){
    throw new apiError(401,"Invalid password");
   };

    const {accessToken, refreshToken} = await createRefreshTokenAndAccessToken(user._id);

    const loggedInuser  = await User.findById(user._id).select(" -password -refreshToken ");
    
    const options ={
        httpOnly:true,
        secure:true,
    }
   
    return res.
    status(200).
    cookie("refreshToken", refreshToken, options).
    cookie("accessToken", accessToken, options).
    json(
       new apiResponse(200,
         {
            user:loggedInuser,
            accessToken,
            refreshToken
         },
         "User logged in successfully"))

})


const logoutUser = asyncHandler(async(req,res)=>{
    const user = req.user;
    await User.findByIdAndUpdate(user._id,
        {
            $set: {
                refreshToken:undefined
            }
        },
        {
            new:true,
        }
    )

       const options ={
        httpOnly:true,
        secure:true,
    }

    return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new apiResponse(200,{},"User logged out successfully"));

})


const generateAccessTokenandRefreshToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken  = req.cookies?.refreshToken || req.body?.refreshToken;

    if(!incomingRefreshToken){
        throw new apiError(400,"Refresh token is required");
    }

    const decoded = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded._id);

    if(!user){
         console.log("User not found for refresh token:", decoded._id);
        throw new apiError(404,"User not found");
       
    }

    if(user.refreshToken !== incomingRefreshToken){
        // console.log(`Incoming refresh token: ${incomingRefreshToken}, User's refresh token: ${user.refreshToken}`);
        // console.error("Refresh token mismatch for user:", user);
        
        throw new apiError(401,"Invalid refresh token from user ");
    };

    const {accessToken, refreshToken} = await createRefreshTokenAndAccessToken(user._id);

    const options ={
        httpOnly:true,
        secure:true,
    }

    return res.
    status(200).
    cookie("refreshToken", refreshToken, options).
    cookie("accessToken", accessToken, options).
    json(
       new apiResponse(200,
         {
            accessToken,
            refreshToken
         },
         "Access token and refresh token generated successfully")
     )

})

export {
    createUser,
    loginUser,
    logoutUser,
    generateAccessTokenandRefreshToken,
}
