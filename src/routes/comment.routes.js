import { Router } from "express";
import {verifyJwt} from "../middlewares/auth.middleware.js";
import { addComment, 
    updateComment,
    deleteComment,
    getVideoComments
} from "../controllers/comment.controller.js";


const router = Router(); 

router.route("/addcomment/:videoId").post(verifyJwt, addComment);
router.route("/updatecomment/:id").post(verifyJwt, updateComment);
router.route("/deletecomment/:id").delete(verifyJwt, deleteComment);
router.route("/getcomments/:videoId").get(verifyJwt, getVideoComments);

export default router;