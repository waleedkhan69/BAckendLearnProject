import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js"; // ✅ Correct Import

const router = Router();

router.route("/register").post(registerUser); // ✅ Correct Function Call

export default router;
