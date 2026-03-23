import { Router } from "express";
import { 
    getChannelVideos,
    getChannelStats
} from "../controllers/dashboard.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/channelvideos/:channelId").get(getChannelVideos);

router.route("/channelstats").get(verifyJwt,getChannelStats);

export default  router