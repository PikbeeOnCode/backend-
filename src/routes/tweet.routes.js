import { verifyJwt } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { 
    createTweet,
    getUserTweets,
    updatetweet,
    deleteTweet
 } from "../controllers/tweet.controllers.js";

 const router = Router();

 router.route("/createtweet").post(verifyJwt, createTweet);
router.route("/mytweets").get(verifyJwt, getUserTweets);
router.route("/updatetweet/:id").patch(verifyJwt, updatetweet);
router.route("/deletetweet/:id").delete(verifyJwt, deleteTweet);


export default router;