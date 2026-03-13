import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.models.js";
import mongoose from "mongoose";

const toggleSubcription = asyncHandler(async(req,res)=>{
    const channelId = req.params.channelId;
    const user =  req.user;

    const existing = await Subscription.findOne({
        subscriber: user._id,
        channel: channelId
    })

    if(!existing){
        const newSubscription = await Subscription.create({
            subscriber: user._id,
            channel: channelId
         
        })
        return res.status(201).json(new apiResponse(201,
         newSubscription,"Subscribed successfully"
        ))  
    }else{

    }

    if(existing){
        const deletedSubscription = await Subscription.findByIdAndDelete(existing._id);
        return res.status(200).json(new apiResponse(200,
             deletedSubscription,"Unsubscribed successfully"
            ))
    }

    console.log("existing", existing);
})


const getUserChannelSubscribers = asyncHandler(async(req,res)=>{
    const user = req.user;

    const susbcribers = await Subscription.aggregate([
        {
            $match:{
                channel: new mongoose.Types.ObjectId(user._id)
            },
            
        },{
            $lookup:{
                from:"users",
                localField:"subscriber",
                foreignField:"_id",
                pipeline:[{
                    $project:{
                        username:1,
                        avatar:1,
                        fullname:1
                    }
                }],
                as:"subscriber"
            }
        },
        {
            $addFields:{
                subscriber:{
                    $first:"$subscriber"
                }
            }
        },
        {
            $project:{
                subscriber:1
            }
        }
    ])

 return res.
status(200).
json(new apiResponse(200, susbcribers,"Subscribers fetched successfully"))
});

const getSubscribedChannels = asyncHandler(async(req,res)=>{
    const user = req.user;

    const subscribedChannel = await Subscription.aggregate([
        {
            $match:{subscriber: new mongoose.Types.ObjectId(user._id)}
        },{
            $lookup:{
                from:"users",
                localField:"channel",
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
                as:"subscribedTo",
            }
        },{
            $addFields:{
                subscribedTo:{
                    $first:"$subscribedTo"
                }
            }
        },
        {
            $project:{
                subscribedTo:1
            }
        }
    ])

    return res.status(200).json(new apiResponse(200, subscribedChannel,"Subscribed channels fetched successfully"))
})

export{
    toggleSubcription,
    getUserChannelSubscribers,
    getSubscribedChannels
}