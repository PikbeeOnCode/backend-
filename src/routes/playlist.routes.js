import { verifyJwt } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import {
    createPlaylist,
} from "../controllers/playlist.controllers.js";
const router = Router();

router.route("/createplaylist").post(verifyJwt, createPlaylist);

export default router;