import express from "express";
import { logoutUser, registerUser, loginUser, refreshToken } from "../controllers/user.controller.js";
import { upload } from "../middelwares/multer.middleware.js";
import { verifyJWT } from "../middelwares/auth.midleware.js";
import refreshToken 

const router = express.Router();

router.post("/register", upload.fields([{ name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), registerUser);

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/access-token").post(refreshToken)

export default router;
