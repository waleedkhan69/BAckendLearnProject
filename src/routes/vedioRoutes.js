import express from "express";
import { getAllVideo, deleteVideo, publishVideo, togglePublishStatus, getVideoById, updateVideo } from "../controllers/video.controller.js"
import { verifyJWT } from "../middelwares/auth.midleware.js";
import { upload } from "../middelwares/multer.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/")
 .get(getAllVideo)
 .post(
  upload.fields([
   { name: "videoFile", maxCount: 1 },
   { name: "thumbnail", maxCount: 1 }
  ]),
  publishVideo
 );

router.route("/:videoId")
 .get(getVideoById)
 .delete(deleteVideo)
 .patch(upload.single("thumbnail"), updateVideo);

router.route("/thumbnail/publish/:videoId")
 .patch(togglePublishStatus);

export default router;
