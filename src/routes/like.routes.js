import { verifyJwt } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { 
    toggleVideoLike,
    toggleCommentLike,
    toggletweetLike
 } from "../controllers/like.controllers.js";


const router = Router();

router.route("/togglevideolike/:videoId").post(verifyJwt, toggleVideoLike);
router.route("/togglecommentlike/:commentId").post(verifyJwt, toggleCommentLike);
router.route("/toggletweetlike/:tweetId").post(verifyJwt, toggletweetLike);

export default router;