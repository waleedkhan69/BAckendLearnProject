import { verifyJWT } from "../middelwares/auth.midleware.js";
import { toggleCommentLike, toggleTweetLike, toggleVideoLike, getVideoLike } from "../controllers/like.controller.js";
import express from "express"

const router = express.Router();

router.post("/video/:VideoId", verifyJWT, toggleVideoLike)
router.post("/comment/:commentId", verifyJWT, toggleCommentLike)
router.post("/tweet/:tweetId", verifyJWT, toggleTweetLike)
router.get("/video/:VideoId", verifyJWT, getVideoLike)

export default router;