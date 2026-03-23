import { Video } from "../models/video.models.js";
import { Playlist } from "../models/playlist.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";
import {Like} from "../models/like.models.js";
import { Subscription } from "../models/subscription.models.js";


const getChannelVideos = asyncHandler(async(req,res)=>{
    const {channelId} = req.params;
    
    if(!channelId){
        throw apiError(res,400,"Channel id is required")
    }

    if(!mongoose.Types.ObjectId.isValid(channelId)){
        throw apiError(res,400,"Invalid channel id")
    }

    const channelVideos = await Video.aggregate([
        {
            $match:{
                owner: new mongoose.Types.ObjectId(channelId)
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
                            avatar:1

                        }
                    }
                ],
                as:"owner"
            }
        },
        {
            $addFields:{
                owner:{
                    $first:"$owner"
                }
            }
        },
        {
            $project:{
                videofile:1,
                thumbnail:1,
                title:1,
                owner:1,

            }
        }
    ])

    return res.status(200).json(
        new apiResponse(true,channelVideos,"Channel videos fetched successfully")
    )

})


const getChannelStats = asyncHandler(async(req,res)=>{
   
    const userId = req.user._id;

    const totalPlaylists = await Playlist.countDocuments({ owner: userId });

    const videoStats = await Video.aggregate([
        {
            $match:{owner:new mongoose.Types.ObjectId(userId)}
        },{
            $group:{
                _id:null,
                totalVideos:{$sum:1},
                totalViews:{$sum:"$views"}
            }
        }
    ])

    

    const totalSubscribers = await Subscription.countDocuments({ subscribedChannels: userId });

 
    const videos = await Video.find({owner:userId}).select("_id");

    const videoIds = videos.map(video => video._id);

    const totalLikes = await Like.countDocuments({video:{$in:videoIds}})

    

    const stats = {
        totalVideos: videoStats[0]?.totalVideos || 0,
        totalPlaylists,
        totalViews: videoStats[0]?.totalViews || 0,
        totalSubscribers,
        totalLikes
        
    }

    return res.
    status(200).
    json(new apiResponse(200, stats,"Channel stats fetched successfully"))

});

export {
    getChannelVideos,
    getChannelStats
}