import mongoose, {isValidObjectId} from "mongoose"
import { Video } from "../models/video.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";

import { uploadOnCloudinary,deleteVideoFromCloudinary,deleteImageFromCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";



const publishVideo = asyncHandler(async(req,res)=>{
    const {title, description} = req.body;


    if(!(title && description)){
       throw new apiError(400, "Title and description are required");
    }
    
    console.log("req.files", req.files);
    const videoLocalPath = req.files?.videofile?.[0]?.path;
    
    if(!videoLocalPath){
        throw new apiError(400, "Video file is not uploaded");
    };


    const video = await uploadOnCloudinary(videoLocalPath);

    if(!video){
        throw new apiError(500, "Video upload failed");
    }

    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    if(!thumbnailLocalPath){
        throw new apiError(400, "Thumbnail file is not uploaded");
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if(!thumbnail){
        throw new apiError(500, "Thumbnail upload failed");
    }

    const ownerId = req.user._id;
    if(!ownerId){
        throw new apiError(401, "Unauthorized");
    }

    const duration = video.duration; // in seconds

    const newvideo = await Video.create({
        videofile: video.secure_url,
        thumbnail: thumbnail.secure_url,
        owner: ownerId,
        title:title,
        description:description,
        duration:duration
    });

    res.
    status(201)
    .json( new apiResponse(201,"Video published successfully", newvideo))

})

const getvideoById = asyncHandler(async(req,res)=>{
    const videoId = req.params.id;

    if(!videoId){
        throw new apiError(400, "Video id is not provided");
    }

    const videoDetails = await Video.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            avatar:1,
                            fullname:1
                        }
                    }
                ],
                as:"ownerDetails"
            }
        },
        {
            $addFields:{
                ownerDetails:{
                    $first:"$ownerDetails"
                }
            }
        },
        {
            $project:{
            videofile:1,
            thumbnail:1,
            title:1,
            description:1,
            duration:1,
            ownerDetails:1
            }
        }
    ]);

    if(!videoDetails.length){
        throw new apiError(404, "Video not found");
    };

    res.status(200).json(new apiResponse(200,  videoDetails,"Video details fetched successfully",)
    )
})

const updateVideo = asyncHandler(async(req,res)=>{
    const VideoId = req.params.id;

    if(!VideoId){
        throw new apiError(400,"video not found")
    };

    const oldVideoDetails = await Video.findById(VideoId);

    if(!oldVideoDetails){
        throw new apiError(404, "Video not found");
    }

    const newVideoDetails ={

    }

    const {title, description} = req.body;

    if(!(title || description)){
        throw new apiError(400, "At least one field is required to update");
    }

    newVideoDetails.title = title || oldVideoDetails.title;
    newVideoDetails.description = description || oldVideoDetails.description;

    const videofile = req.files?.videofile?.[0]?.path;

    if(videofile){

        const newVideo = await uploadOnCloudinary(videofile);

        if(!newVideo){
            throw new apiError(500, "Video upload failed");
        }

        await deleteVideoFromCloudinary(oldVideoDetails.videofile)
        newVideoDetails.videofile = newVideo.secure_url;
        newVideoDetails.duration = newVideo.duration;
    }

    const thumbnail = req.files?.thumbnail?.[0]?.path;

    if(thumbnail){
        const newThumbnail = await uploadOnCloudinary(thumbnail);
        if(!newThumbnail){
            throw new apiError(500, "Thumbnail upload failed");
        }

        await deleteImageFromCloudinary(oldVideoDetails.thumbnail)
        newVideoDetails.thumbnail = newThumbnail.secure_url;
       
    }

  const updatedVideoDetails = await Video.findByIdAndUpdate(VideoId,{
    $set: newVideoDetails
  },{new:true});
 
    if(!updatedVideoDetails) {
        throw new apiError(500, "Video details update failed");
    };

    res.
    status(200)
    .json(new apiResponse(200, updatedVideoDetails, "Video details updated successfully"))

 })
export {
    publishVideo,
    getvideoById,
    updateVideo
   
}
