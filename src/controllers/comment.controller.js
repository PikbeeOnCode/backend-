import mongoose ,{isValidObjectId} from "mongoose";
import {Comment} from "../models/comment.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";


const addComment = asyncHandler(async(req,res)=>{
    const {content} = req.body;
    const videoId = req.params.videoId;
    const user = req.user;

    if(!content){
        throw new apiError(400,"Content is required");
    }

    if(!videoId){
        throw new apiError(404,"Video not found");
    }

      if(!isValidObjectId(videoId)){
        throw new apiError(400,"Invalid video id");
    }

    const newComment = await Comment.create({
        content,
        video: videoId,
        owner: user._id,
    })

    if(!newComment){
        throw new apiError(500,"Failed to add comment");
    }

    return res.
    status(201).
    json(new apiResponse(201,newComment,"Comment added successfully"));
})


const updateComment = asyncHandler(async(req,res)=>{
    const user = req.user;
    const commentId = req.params.id;
    const {content} = req.body;

    if(!user){
        throw new apiError(401,"User is not logged in ");
    }

    if(!commentId){
        throw new apiError(400,"Comment Id is not available ");
    }

    if(!content){
        throw new apiError(400,"Content is required");
    }

    const existingComment = await Comment.findById(commentId);

    if(!existingComment){
        throw new apiError(404,"comment not found");
    }

    if(existingComment.owner.toString() !== user._id.toString()){
        throw new apiError(403,"You are not authorized to update this comment");
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{
                content
            }
        }  ,
        { new: true }
    );

    if(!updatedComment){
        throw new apiError(500,"Failed to update comment");
    }

    return res
        .status(200)
        .json(new apiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async(req,res)=>{
    const user = req.user;
    const commentId = req.params.id;

    if(!user){
        throw new apiError(401,"User is not logged in ");
    }

    if(!commentId){
        throw new apiError(400,"Comment Id is not available ");
    };

    const existingComment = await Comment.findById(commentId);

    if(!existingComment){
        throw new apiError(404,"comment not found");
    }

    if(user._id.toString() !== existingComment.owner.toString()){
        throw new apiError(403,"You are not authorized to delete this comment");
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if(!deletedComment){
        throw new apiError(500,"Failed to delete comment");
    }

    return res.
    status(200).
    json(new apiResponse(200, deletedComment, "Comment deleted successfully"));
})

 const getVideoComments = asyncHandler(async(req,res)=>{
    const videoId = req.params.videoId;
    const user = req.user;
    const {page = 1, limit = 10} = req.query
    if(!user){
        throw new apiError(401,"User is not logged in ");
    }

    if(!videoId){
        throw new apiError(400,"Video id is required");
    }

    const pipeLine =[];

    if(videoId){
        pipeLine.push({
            $match:{
                video: new mongoose.Types.ObjectId(videoId)
            }
        });
        }

        if(user){
         pipeLine.push({
            $match:{
                owner: new mongoose.Types.ObjectId(user._id)
                }
            });
        }

        pipeLine.push({
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                pipeline:[{
                    $project:{
                        username:1,
                        avatar:1,
                    }
                }],
                as:"owner"
            }
        });
         pipeLine.push({
            $addFields:{
                owner: { $first: "$owner" }
            }
         })



        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
        }


        const comments = await Comment.aggregatePaginate(
            Comment.aggregate(pipeLine),options
        )
        
        res.status(200).json(new apiResponse(200, comments, "Comments fetched successfully"));
})


export {
    addComment,
    updateComment,
    deleteComment,
    getVideoComments
}