import jwt from "jsonwebtoken";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { 
    toggleSubcription ,
    getUserChannelSubscribers,
    getSubscribedChannels
} from "../controllers/subcription.controller.js";



const router = Router();


router.route("/toggle/:channelId").post(verifyJwt, toggleSubcription);

router.route("/channel-subscribers").get(verifyJwt, getUserChannelSubscribers);

router.route("/subscribed-channels").get(verifyJwt, getSubscribedChannels);

export default router

