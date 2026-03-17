import { Video } from "../models/video.models.js";
import { Playlist } from "../models/playlist.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";


const createPlaylist = asyncHandler(async(req,res)=>{
    const user = req.user;
    const {name, description} = req.body;

    if(!name){
        throw new apiError(400, "Playlist name is required");
    }

    if(description && description.trim() === ""){
        throw new apiError(400, "Description cannot be empty");
    }

    const crreatePlaylist = await Playlist.create({
        name:name,
        description:description,
        owner:user._id
    })

     return res.
    status(201).
    json(new apiResponse(201, "Playlist created successfully", crreatePlaylist))

});



export {
    createPlaylist,

}
   