import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";
import { Comment } from "../models/comment.models.js";
import { Like } from "../models/like.models.js";


const toggleVideoLike = asyncHandler(async(req,res)=>{
    const videoId = req.params.videoId;
    const user = req.user

    if(!videoId){
        throw new apiError(400,"Video id is required");
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new apiError(404,"Video not found");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: user._id,
    })

    if(existingLike){
      const dislike =   await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new apiResponse(200,dislike,"Video unliked successfully"));
    }

    if(!existingLike){
        const newLike = await Like.create({
            video: videoId,
            likedBy: user._id,
        })
        if(!newLike){
            throw new apiError(500,"Failed to like the video");
        }
        return res.status(201).json(new apiResponse(201,newLike,"Video liked successfully"));
    }
})




export {
     toggleVideoLike 
    }