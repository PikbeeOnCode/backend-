import { verifyJwt } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import {
    createPlaylist,
    addVideoToPlaylist,
    getUserPlaylists,
    getPlaylistbyId,
    removeVideoFromPlaylist,
    deleteplaylist
    ,updateplaylist
} from "../controllers/playlist.controllers.js";
const router = Router();

router.route("/createplaylist").post(verifyJwt, createPlaylist);
router.route("/addvideo/:PlaylistId/:videoid").post(verifyJwt, addVideoToPlaylist);
router.route("/getplaylists/:userId").get(verifyJwt, getUserPlaylists);
router.route("/getplaylist/:playlistId").get(verifyJwt, getPlaylistbyId);
router.route("/removevideo/:PlaylistId/:videoid").delete(verifyJwt, removeVideoFromPlaylist);
router.route("/deleteplaylist/:playlistId").delete(verifyJwt, deleteplaylist);
router.route("/updateplaylist/:playlistId").patch(verifyJwt, updateplaylist);

export default router;
