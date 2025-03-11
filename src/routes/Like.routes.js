import { verifyJWT } from "../middelwares/auth.midleware";
import { toggleCommentLike, toggleTweetLike, toggleVideoLike, getVideoLike } from "../controllers/like.Controller";
import express from "express"

const router = express.Router();

router.post("/video/:VideoId", verifyJWT, toggleVideoLike)
router.post("/comment/:commentId", verifyJWT, toggleCommentLike)
router.post("/tweet/:tweetId", verifyJWT, toggleTweetLike)
router.post("/vedio/:VideoId", verifyJWT, getVideoLike)