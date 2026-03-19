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

const addVideoToPlaylist = asyncHandler(async(req,res)=>{
    const user = req.user;
    const {PlaylistId,videoid}= req.params;

    
    if(!PlaylistId){
        throw new apiError(400, "Playlist id is required");
    }

    if(!mongoose.Types.ObjectId.isValid(PlaylistId)){
        throw new apiError(400, "Invalid playlist id");
    }

      if(!videoid){
        throw new apiError(400, "Video id is required");
    }

    if(!mongoose.Types.ObjectId.isValid(videoid)){
        throw new apiError(400, "Invalid video id");
    }



    const playlist = await Playlist.findById(PlaylistId);

    if(!playlist){
        throw new apiError(404, "Playlist not found");
    }

    if(playlist.owner.toString() !== user._id.toString()){
        throw new apiError(403, "You are not authorized to add video to this playlist");
    }

        const wasAlreadyInPlaylist = playlist.videos.some(
        vid => vid.toString() === videoid
    );

    if (wasAlreadyInPlaylist) {
        return res.status(200).json(
            new apiResponse(
                200,
                playlist,               
                "This video is already in the playlist"
            )
        );
    }
  

    const addedvideoplaylist = await Playlist.findByIdAndUpdate(PlaylistId,{
        $addToSet:{videos:videoid}
    },{
        new:true
    })

    if(!addedvideoplaylist){
        throw new apiError(404, "Playlist not found");
    }

    return res.
    status(200).
    json(new apiResponse(200,  addedvideoplaylist,"Video added to playlist successfully"))
    
})

const getUserPlaylists = asyncHandler(async(req,res)=>{
    const userId = req.params.userId;

    if(!userId){
        throw new apiError(400, "User id is required");
    }

    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new apiError(400, "Invalid user id");
    }
    

    const playlists = await Playlist.find(
        {owner:userId}
    )

    return res.
    status(200).
    json(new apiResponse(200, playlists,"User playlists fetched successfully"))
})

const getPlaylistbyId = asyncHandler(async(req,res)=>{
    const playlistId = req.params.playlistId;

    if(!playlistId){
        throw new apiError(400, "Playlist id is required");
    }

    if(!mongoose.Types.ObjectId.isValid(playlistId)){
        throw new apiError(400, "Invalid playlist id");
    }

    const playlist = await Playlist.findById(playlistId)
        .populate({
            path: "videos",
            select: "title description thumbnail owner views duration isPublished createdAt"
        })
        .populate({
            path: "owner",
            select: "username fullname avatar"
        });

    if(!playlist){
        throw new apiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, playlist, "Playlist fetched successfully"));
})

export {
    createPlaylist,
    addVideoToPlaylist,
    getUserPlaylists,
    getPlaylistbyId
}
   
