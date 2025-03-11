import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { upload } from "./middelwares/multer.middleware.js";
import { registerUser } from "./controllers/user.controller.js";
import Likeroute from "./routes/Likeroutes.js"

const app = express();

app.use(cors({
 origin: process.env.CORS_ORIGIN,
 credentials: true
}));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import router from "./routes/user.routes.js";

app.post('/register', upload.fields([
 { name: 'avatar', maxCount: 1 },
 { name: 'coverImage', maxCount: 1 }
]), registerUser);


app.use("/api/v1/")
app.use("/api/v1/", router);
app.use("/api/likes", Likeroute)
app.use("/api/likes/video/:videoId", Likeroute)
app.use("/api/likes/comment/:commentId", Likeroute)
app.use("/api/likes/tweet/:tweetId ", Likeroute)
app.use("/api/likes/vedio/:videoId", Likeroute)

export { app };
