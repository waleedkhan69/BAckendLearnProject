import { asyncHandler } from "../utils/asyncHandler.js"; // ✅ Correct Import
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { UploadOnCloudinary } from "../utils/cloudanary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
 // user details 
 // validation not emapty
 // if user already exist
 // check for images check for avator
 // uploud thenon the cloudinary
 // creayte user object - create entery in db 
 // remove refreshtoken field from response

 const { fullName, email } = req.body
 console.log("email", email);
 if ([fullName, email, password, userName].some((field) => field?.trim() === "")) {
  throw new ApiError(400, "All fields  is required")
 }
 const userExist = User.findOne({
  $or: [{ email }, { userName }]
 })
 if (userExist) {

  throw new ApiError(409, "user already exist");


 }

 const avatarLocalPath = req.files?.avatar[0]?.path
 const coverImage = req.files?.coverimge[0]?.path

 if (!avatarLocalPath) {
  throw new ApiError(400, "avatar file is required")

 }
 const avatar = await UploadOnCloudinary(avatarLocalPath)
 const covImg = await UploadOnCloudinary(coverImage)

 if (!avatar) {
  throw new ApiError(400, "avataor is not find");


 }

 const user = await User.create({
  fullName,
  avatar: avatar.url,
  covImg: covImg?.url || "",
  email,
  password,
  username: userName.toLowerCase()
 })

 const createuser = await User.findById(user._id).slect(
  "-password  -refirshToken"
 )

 console.log("createuser", createuser);

 if (!createuser) {
  throw new ApiError(500, "somthing went wrong while while registering the user ");


 }
 return res.status(201).json(
  new ApiResponse(200, createuser, "user register Succussfly")
 )


});

export { registerUser };
