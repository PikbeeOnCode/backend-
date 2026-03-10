import { Router } from "express";
import {
     createUser,
     loginUser,
     logoutUser,
     generateAccessTokenandRefreshToken,
     changeUserpassword,
     getuserProfile,
    updateUserProfileDetails,
    updateAvatar,
    updateCoverImage,
    getUserChannelProfile,
    getUserWatchHistory
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

router.route("/refresh-token").post(generateAccessTokenandRefreshToken);
router.route("/change-password").post(verifyJwt, changeUserpassword);

router.route("/profile").get(verifyJwt, getuserProfile);
router.route("/profile-update").patch(verifyJwt, updateUserProfileDetails);

router.route("/update-avatar").patch(verifyJwt, upload.single("avatar"), updateAvatar);

router.route("/update-cover-image").patch(verifyJwt, upload.single("coverImage"), updateCoverImage);

router.route("/channel/:username").get(verifyJwt,getUserChannelProfile);

router.route('/watch-history').get(verifyJwt, getUserWatchHistory);

export default router;