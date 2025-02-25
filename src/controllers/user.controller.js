import { asyncHandler } from "../utils/asyncHandler.js"; // ✅ Correct Import
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import fs from "fs";

const registerUser = asyncHandler(async (req, res) => {
 try {
  console.log("📂 Files Received:", req.files);
  console.log("📄 Body Data:", JSON.stringify(req.body, null, 2));

  // Check if avatar file is uploaded
  if (!req.files || !req.files.avatar || req.files.avatar.length === 0) {
   throw new ApiError(400, "Avatar upload failed: No avatar file uploaded!");
  }

  // Extract paths for avatar and coverImage
  const avatarLocalPath = req.files.avatar[0].path.replace(/\\/g, "/");
  const coverImageLocalPath = req.files.coverImage?.[0]?.path.replace(/\\/g, "/") || null;

  console.log("✅ Avatar Path:", avatarLocalPath);
  console.log("✅ Cover Image Path:", coverImageLocalPath);

  // Check if the avatar file exists on the server
  if (!fs.existsSync(avatarLocalPath)) {
   throw new ApiError(400, "Avatar file is missing on the server");
  }

  // Step 1: Get user details from request body
  const { fullName, email, password, userName } = req.body;

  // Step 2: Validate fields
  const fields = [fullName, email, password, userName].map((field) => field?.trim());
  console.log("🔍 Trimmed Fields:", fields);

  if (fields.some((field) => !field)) {
   throw new ApiError(400, "All fields are required and cannot be empty");
  }

  // Step 3: Check if user already exists
  const userExist = await User.findOne({ $or: [{ email }, { userName }] });

  if (userExist) {
   throw new ApiError(409, "User with this email or username already exists");
  }

  // Step 4: Create user object and save to database
  const user = await User.create({
   fullName,
   email,
   password,
   username: userName.toLowerCase(),
   avatar: avatarLocalPath, // Save local path instead of Cloudinary URL
   coverImage: coverImageLocalPath || "", // Optional cover image
  });

  // Step 5: Fetch created user without sensitive fields
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
   throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
 } catch (error) {
  console.error("🚨 Error in registerUser:", error);
  res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message));
 }
});





export { registerUser };