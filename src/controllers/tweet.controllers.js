import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";

const createTweet = asyncHandler(async(req,res)=>{
    const {content} = req.body;
    const userId  = req.user._id;

    if(!content){
        new apiError(400,"content is required");
    }

    if(!userId){
        new apiError(401," user id not available");
    }

    const newTweet = await Tweet.create({
        content,
        owner:userId,
    })

    if(!newTweet){
        new apiError(500,"Tweet creation failed");
    }
    return res.status(201).json(new apiResponse(201,newTweet,"Tweet created successfully"));
})

const getUserTweets = asyncHandler(async(req,res)=>{
    const userId = req.user._id;

    if(!userId){
        new apiError(401," user id not available");
    }

   const tweets = await Tweet.find({ owner: req.user._id })
    .populate("owner", "username avatar fullname")

   return res.status(200).json(new apiResponse(200,tweets,"User tweets fetched successfully"));
});

const updatetweet = asyncHandler(async(req,res)=>{
 const tweetid = req.params.id;
 const user = req.user;
 if(!tweetid){
    throw new apiError(400,"tweet id is required");
 }

 const existingTweet = await Tweet.findById(tweetid);


 if(tweetid && existingTweet.owner.toString() !== user._id.toString()){
        throw new apiError(403,"You are not the authorize to update this tweet");
    }

 const {content} = req.body;

 if(!content){
    throw new apiError(400,"content is not filled");
 }

 const updatedtweet =await Tweet.findByIdAndUpdate(
    tweetid,
    { $set: { content } }, 
)

res.status(200).json(new apiResponse(200,updatedtweet,"Tweet updated successfully"))
})

const deleteTweet = asyncHandler(async(req,res)=>{
    const tweetid = req.params.id;
    const user = req.user
    
    if(!tweetid){
        throw new apiError(400,"tweet id is required");
     }

     const existingTweet = await Tweet.findById(tweetid);

     if(!existingTweet){
        throw new apiError(404,"Tweet not found");
     }

     if(tweetid && existingTweet.owner.toString() !== user._id.toString()){
        throw new apiError(403,"You are not the authorize to delete this tweet");
    }

    const deletetweet =   await Tweet.findByIdAndDelete(tweetid);

    res.status(200).json(new apiResponse(200,deletetweet,"Tweet deleted successfully"))
});

export { createTweet,
     getUserTweets, 
     updatetweet,
      deleteTweet }