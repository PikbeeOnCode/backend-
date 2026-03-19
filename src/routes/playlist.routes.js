import { verifyJwt } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import {
    createPlaylist,
    addVideoToPlaylist,
    getUserPlaylists,
    getPlaylistbyId
} from "../controllers/playlist.controllers.js";
const router = Router();

router.route("/createplaylist").post(verifyJwt, createPlaylist);
router.route("/addvideo/:PlaylistId/:videoid").post(verifyJwt, addVideoToPlaylist);
router.route("/getplaylists/:userId").get(verifyJwt, getUserPlaylists);
router.route("/getplaylist/:playlistId").get(verifyJwt, getPlaylistbyId);

export default router;
