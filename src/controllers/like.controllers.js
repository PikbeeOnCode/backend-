import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";
import { Comment } from "../models/comment.models.js";
import { Like } from "../models/like.models.js";
import { Tweet } from "../models/tweet.models.js";


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


const toggleCommentLike = asyncHandler(async(req,res)=>{
    const commentId = req.params.commentId;
    const user = req.user

    if(!commentId){
        throw new apiError(400,"Comment id is required");
    }

    const comment = await Comment.findById(commentId);

    if(!comment){
        throw new apiError(404,"Comment not found");
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: user._id,
    })

    if(existingLike){
      const dislike =   await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new apiResponse(200,dislike,"Comment unliked successfully"));
    }

    if(!existingLike){
        const newLike = await Like.create({
            comment: commentId,
            likedBy: user._id,
        })
        if(!newLike){
            throw new apiError(500,"Failed to like the comment");
        }
        return res.status(201).json(new apiResponse(201,newLike,"Comment liked successfully"));
    }
})

const toggletweetLike = asyncHandler(async(req,res)=>{
    const tweetId = req.params.tweetId;
    const user = req.user

    if(!tweetId){
        throw new apiError(400,"Tweet id is required");
    }

    const tweet = await Tweet.findById(tweetId);

    if(!tweet){
        throw new apiError(404,"Tweet not found");
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: user._id,
    })

    if(existingLike){
      const dislike =   await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new apiResponse(200,dislike,"Tweet unliked successfully"));
    }

    if(!existingLike){
        const newLike = await Like.create({
            tweet: tweetId,
            likedBy: user._id,
        })
        if(!newLike){
            throw new apiError(500,"Failed to like the tweet");
        }
        return res.status(201).json(new apiResponse(201,newLike,"Tweet liked successfully"));
    }
})




export {
     toggleVideoLike ,
     toggleCommentLike,
     toggletweetLike
    }