import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    publishVideo,
    getvideoById,
    updateVideo,
    deleteVideo,
    getAllVideos,
    togglePublishVideo
 } from "../controllers/video.controller.js";

const router = Router();

router.route("/publish-video").post(
    verifyJwt,
    upload.fields([
        { name: "videofile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    publishVideo
);

router.route("/getvideo/:id").get(verifyJwt, getvideoById);


router.route("/updatevideo/:id").post(verifyJwt, upload.fields([
        { name: "videofile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]), updateVideo);

router.route("/deletevideo/:id").delete(verifyJwt, deleteVideo);

router.route("/allvideos").get(verifyJwt, getAllVideos);

router.route("/toggle-publish/:id").patch(verifyJwt, togglePublishVideo);

export default router