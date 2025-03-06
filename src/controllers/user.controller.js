import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"



import fs from "fs";
import { lookup } from "dns";
import { pipeline } from "stream";

const generateAndAccessToken = async (userId) => {
  try {
    console.log("Received userId:", userId);
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found", userId);
      throw new ApiError(404, "User not found");
    }

    console.log("User object:", user);

    if (!user.generateAndAccessToken || !user.generateRefreshToken) {
      console.log("Error: Methods not found in user object");
      throw new ApiError(500, "Token generation methods missing in User model");
    }

    const accessToken = await user.generateAccessToken();
    console.log("Generated access token:", accessToken);

    const refreshToken = await user.generateRefreshToken();
    console.log("Generated refresh token:", refreshToken);

    user.refreshToken = refreshToken;
    console.log("Saving user with new refresh token...");
    await user.save({ validateBeforeSave: false });
    console.log("User saved successfully");

    return { refreshToken, accessToken };
  } catch (error) {
    console.log("Error while generating the token:", error);
    throw new ApiError(500, "Something went wrong while generating the tokens");
  }
};



const registerUser = asyncHandler(async (req, res) => {
  try {
    if (!req.files || !req.files.avatar || req.files.avatar.length === 0) {
      throw new ApiError(400, "Avatar upload failed: No avatar file uploaded!");
    }

    const avatarLocalPath = req.files.avatar[0].path.replace(/\\/g, "/");
    const coverImageLocalPath =
      req.files.coverImage?.[0]?.path.replace(/\\/g, "/") || null;

    if (!fs.existsSync(avatarLocalPath)) {
      throw new ApiError(400, "Avatar file is missing on the server");
    }

    const { fullName, email, password, username } = req.body;

    const fields = [fullName, email, password, username].map((field) =>
      field?.trim()
    );

    if (fields.some((field) => !field)) {
      throw new ApiError(400, "All fields are required and cannot be empty");
    }

    const userExist = await User.findOne({ $or: [{ email }, { username }] });

    if (userExist) {
      throw new ApiError(409, "User with this email or username already exists");
    }

    const user = await User.create({
      fullName,
      email,
      password,
      username: username.toLowerCase(),
      avatar: avatarLocalPath,
      coverImage: coverImageLocalPath || "",
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered successfully"));
  } catch (error) {
    console.error("🚨 Error in registerUser:", error);
    res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ((!username && !email)) {
    throw new ApiError(400, "Email or username is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect password. Please enter the valid password");
  }

  const { accessToken, refreshToken } = await generateAccessToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully")
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
  if (!refreshAccessToken) {
    throw new ApiError(401, "unauthorized Request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_Token
    )

    const user = await User.findById(decodedToken?._id
    )

    if (!user) {
      throw new ApiError(401, "invalid refresh token")
    }

    if (!incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Invalid token is expired or used")

    }
    const options = {
      httpOnly: true,
      secure: true
    }

    const { accessToken, newrefreshToken } = await generateAccessToken(user._id)

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            refreshToken: newrefreshToken,
            accessToken
          },
          "Access token refresh successfully"
        )
      )




  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token")

  }

})

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { OldPassword, newPassword } = req.body

  const user = await User.findById(req.user?._id)

  const isPasswordCorrect = await user.isPasswordCorrect(OldPassword)
  console.log("isPasswordCorrect", isPasswordCorrect);


  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid password")
  }

  user.password = new newPassword
  await user.save({ validateBeforeSave: false })

  return res.status(200)
    .json(new ApiResponse(200, {}, "password change successfully"))


})
const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"))
})
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body

  if (!fullName || !email) {
    throw new ApiError(400, "All field are required")
  }

  const user = User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        email: email
      }
    },
    { new: true }

  ).select("-password")

  return res.status(200)
    .json(200, user, "user account update successfully")
})
const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is missing")

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
      throw new ApiError(400, "Error while uploading on avatar")
    }

    await User.findByIdAndUpdate(
      req.user?._id,
      {

        $set: {
          avatar: avatar.url
        },

      },
      { new: true }
    ).select("-password")
    return res.status(200)
      .json(
        new ApiResponse(200, {}, "coverImage update Successfully ")
      )

  }
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path
  if (!coverImageLocalPath) {
    throw new ApiError(400, "avatar file is missing please checkout")

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
      throw new ApiError(400, "Error while uploading on avatar")
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {

        $set: {
          avatar: avatar.url
        }

      },
      { new: true }
    ).select("-password")
    return res.status(200)
      .json(
        new ApiResponse(200, user, "coverImage update Successfully ")
      )

  }
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username.trim()) {
    throw new ApiError(400, "user is missing")
  }
  const channel = await User.aggregate([
    {
      $match: {
        username: username.toLowerCase()
      },
    },
    {
      $lookup: {
        from: "subscription",
        foreignField: "channel",
        localField: "_id",
        as: "subscription"
      }
    },
    {
      $lookup: {
        from: "subscription",
        foreignField: "channel",
        localField: "_id",
        as: "subscriptions"
      }
    },
    {
      $addFields: {
        subscriberCount: { $size: "$subscriptions" },
        ChannelSubscriptionToCount: { $size: "SubscribTo" },
        isSubscrib: {
          $cond: {
            if: { $in: [req?.user_id, "$subscriptions.subscriber"] },
            then: true,
            else: false
          }
        }
      }
    },
    {
      $project: {
        fullName: 1,
        subscriberCount: 1,
        channelsSubscribToCount: 1,
        isSubscrib: 1,
        coverImage: 1,
        avatar: 1,
        email: 1
      }
    }
  ])

  if (!channel.length) {
    throw new ApiError(400, "channel dose not exist")
  }
  return res.status(200)
    .json(new ApiResponse(200, channel[0], "user is fetched is successfully"))
})
const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $lookup: {
        from: "Vedio",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    fullname: 1,
                    avatar: 1
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ])
})


export { registerUser, loginUser, refreshAccessToken as refreshToken, logoutUser, getCurrentUser, changeCurrentPassword, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory };
