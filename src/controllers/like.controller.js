import { Likes } from "../models/Likes.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose";


const toggleVideoLike = asyncHandler(async (req, res) => {
 const { VideoId } = req.params;
 const userId = req.user.id;

 if (!isValidObjectId(VideoId)) throw new ApiError(400, "Invalid Video ID");

 const existingLike = await Likes.findOne({ video: VideoId, likeBy: userId });
 if (existingLike) {
  await Likes.findByIdAndDelete(existingLike._id);
  return res.status(200).json(new ApiResponse(200, "Like removed successfully", {}));
 }

 await Likes.create({ video: VideoId, likeBy: userId });
 return res.status(201).json(new ApiResponse(201, "Like added successfully"));
});

// Toggle Comment Like
const toggleCommentLike = asyncHandler(async (req, res) => {
 const { commentId } = req.params;
 const userId = req.user.id;

 if (!isValidObjectId(commentId)) throw new ApiError(400, "Invalid Comment ID");

 const existingLike = await Likes.findOne({ comment: commentId, likeBy: userId });
 if (existingLike) {
  await Likes.findByIdAndDelete(existingLike._id);
  return res.status(200).json(new ApiResponse(200, "Comment like removed successfully", {}));
 }

 await Likes.create({ comment: commentId, likeBy: userId });
 return res.status(201).json(new ApiResponse(201, "Comment liked successfully"));
});

// Toggle Tweet Like
const toggleTweetLike = asyncHandler(async (req, res) => {
 const { tweetId } = req.params;
 const userId = req.user.id;

 if (!isValidObjectId(tweetId)) throw new ApiError(400, "Invalid Tweet ID");

 const existingLike = await Likes.findOne({ tweet: tweetId, likeBy: userId });
 if (existingLike) {
  await Likes.findByIdAndDelete(existingLike._id);
  return res.status(200).json(new ApiResponse(200, "Tweet like removed successfully", {}));
 }

 const newTweet = await Likes.create({ tweet: tweetId, likeBy: userId });
 return res.status(201).json(new ApiResponse(201, "Tweet liked successfully", newTweet));
});

// Get Video Likes
const getVideoLike = asyncHandler(async (req, res) => {
 const { VideoId } = req.params;
 if (!isValidObjectId(VideoId)) throw new ApiError(400, "Invalid Video ID");

 const likes = await Likes.find({ video: VideoId }).populate("likeBy", "username");
 return res.status(200).json(new ApiResponse(200, "Likes fetched successfully", likes));
});

export {
 toggleCommentLike,
 toggleTweetLike,
 toggleVideoLike,
 getVideoLike
};
