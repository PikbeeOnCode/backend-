import { verifyJwt } from "../middlewares/auth.middleware.js";
import { Router } from "express";

import { 
    toggleVideoLike,
 } from "../controllers/like.controllers.js";
const router = Router();

router.route("/togglevideolike/:videoId").post(verifyJwt, toggleVideoLike);

export default router;