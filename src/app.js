import likeroutes from "./routes/Likeroutes.js"
import vedioRoutes from "./routes/vedioRoutes.js"
import cookieParser from "cookie-parser";
import { verifyJWT } from "./middelwares/auth.midleware.js";
import mongoose from "mongoose";

import cors from "cors";
import express from "express";
import { upload } from "./middelwares/multer.middleware.js";
import { registerUser } from "./controllers/user.controller.js";
import router from "./routes/user.routes.js";

const app = express();

app.use(cookieParser());
app.use(cors({
 origin: process.env.CORS_ORIGIN,
 credentials: true
}));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.static("public"));


app.post('/register', upload.fields([
 { name: 'avatar', maxCount: 1 },
 { name: 'coverImage', maxCount: 1 }
]), registerUser);

app.use("/api/v1/", router);
app.use("/api/V1/likes", likeroutes);
app.use("/api/V1/videos", vedioRoutes)

export { app };
