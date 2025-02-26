import { asyncHandler } from "../utils/asyncHandler.js"; // ✅ Correct Import
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import fs from "fs";


const generateAndAccesToken = async (userId) => {
 try {
  const user = await user.findById(userId)
  const accessToken = user.generateAndAccesToken
  const refreshToken = user.generateRefreshToken

  user.refreshToken = refreshToken
  await user.save({ validateBeforeSave: false })

  return { refreshToken, accessToken }



 } catch (error) {
  throw new ApiError(500, "somthing went wrong while generating the refresh and access token")
 }
}
const registerUser = asyncHandler(async (req, res) => {
 try {
  if (!req.files || !req.files.avatar || req.files.avatar.length === 0) {
   throw new ApiError(400, "Avatar upload failed: No avatar file uploaded!");
  }


  const avatarLocalPath = req.files.avatar[0].path.replace(/\\/g, "/");
  const coverImageLocalPath = req.files.coverImage?.[0]?.path.replace(/\\/g, "/") || null;




  if (!fs.existsSync(avatarLocalPath)) {
   throw new ApiError(400, "Avatar file is missing on the server");
  }


  const { fullName, email, password, username } = req.body;


  const fields = [fullName, email, password, username].map((field) => field?.trim());


  if (fields.some((field) => !field)) {
   throw new ApiError(400, "All fields are required and cannot be empty");
  }


  const userExist = await User.findOne({ $or: [{ email }, { username }] });

  if (userExist) {
   throw new ApiError(409, "User with this email or username already exists");
  }
  let coverImages;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
   coverImages = req.files.coverImage[0].path;
  }



  const user = await User.create({
   fullName,
   email,
   password,
   username: username.toLowerCase(),
   avatar: avatarLocalPath,
   coverImage: coverImageLocalPath || "",
  });


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


const loginUser = asyncHandler(async (req, res) => {
 // get user -> data 
 // username or email
 // find the user 
 // password check 
 // access and refresh token
 // send cookei


 const { username, email, password } = req.body

 if (!username || !email) {
  throw new ApiError(400, " email or password is required")
 }
 const user = await User.findOne({
  $or: [{ username }, { email }]
 })

 if (!user) {
  throw new ApiError(404, "User dost not exist")

 }

 const isPasswordValidation = await user.isPasswordCorrect(password)

 if (!isPasswordValidation) {
  throw new ApiError(401, "incorrect password Please inter the valid password")

 }

 const { accessToken, refreshToken } = await generateAndAccesToken(user._id)

 const LoggedinUser = await User.findById(user._id).select(
  "-password  -refreshToken"
 )

 const options = {
  http: true,
  secure: true
 }

 return res.status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
   new ApiResponse(
    200,
    {
     user: LoggedinUser, accessToken, refreshToken
    },
    "User Login successfully"
   )
  )

 const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
   req.user._id,

   {
    $set: {
     refreshToken: undefined
    },

   },
   {
    new: true
   }
  )
  const option = {
   http: true,
   secure: true
  }

 })
}

})




export { registerUser, loginUser, logoutUser };