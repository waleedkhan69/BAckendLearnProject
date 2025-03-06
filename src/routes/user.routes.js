import express from "express";
import { logoutUser, registerUser, loginUser, refreshToken, updateUserAvatar, updateUserCoverImage, updateAccountDetails, getCurrentUser, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import { upload } from "../middelwares/multer.middleware.js";
import { verifyJWT } from "../middelwares/auth.midleware.js";



const router = express.Router();

router.post("/register", upload.fields([{ name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), registerUser);
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/current-user").patch(verifyJWT, getCurrentUser)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/access-token").post(refreshToken)

export default router;
