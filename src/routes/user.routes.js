import { Router } from "express";
import {
     createUser,
     loginUser,
     logoutUser,
     generateAccessTokenandRefreshToken
     } from "../controllers/user.controller.js";  
import {upload} from "./../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    createUser
)

router.route("/login").post(loginUser)

// secured routes 

router.route("/logout").post(verifyJwt, logoutUser);

router.route("/refresh-token").post(generateAccessTokenandRefreshToken)
export default router;