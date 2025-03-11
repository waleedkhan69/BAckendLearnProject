import { Likes } from "../models/Likes.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import mongoose, { isValidObjectId } from "mongoose";


const toggleVideoLike = asyncHandler(async (req, res) => {
 const { VideoId } = req.params
 const userId = req.user.id;
 if (!isValidObjectId(VideoId)) throw new ApiError(400, "invalid Video id")

 const existingLike = await Likes.findOne({ video: VideoId, likeBy: userId })
 if (existingLike) {
  await Likes.findByIdAndDelete(existingLike._id)
  return res.status(200).json(new ApiResponse(200, "Like remove successfully ", {}))
 }
 const newLike = Likes.create({ video: VideoId, likeBy: userId })
 return res.status(200).json(new ApiResponse(200, "Like Add successfully"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
 const { commentId } = req.params
 const userId = req.user.id;
 if (!isValidObjectId(commentId)) throw new ApiError(400, "invalid comment ID")

 const existingLike = await Likes.findOne({ comment: commentId, likeBy: userId })
 if (existingLike) {
  await Likes.findByIdAndDelete(existingLike._id)
  return res.status(200).json(new ApiResponse(201, "commment remove successfully", {}))
 }

 const newcomment = Likes.create({ comment: commentId, commentBy: commentId })
 res.status(201).json(new ApiResponse(201, "Add comment successfully"))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
 const { tweetId } = req.params
 const userId = req.user.id;

 if (!isValidObjectId(tweetId)) throw new ApiError(400, "invalid tweet ID")

 const existingLike = await Likes.findOne({ tweet: tweetId, likeBy: userId })

 if (existingLike) {
  await Likes.findByIdAndDelete(existingLike._id)
  return res.status(200).json(new ApiResponse(200, "Tweet remove successfully"))
 }

 const newTweet = await Likes.create({ tweet: tweetId, likeBy: userId })
 return res.status(200).json(new ApiResponse(200, "tweet Add successfully", newTweet))
})
const getVideoLike = asyncHandler(async (req, res) => {
 const { videoId } = req.params
 const userId = req.user.id;
 if (!isValidObjectId(videoId)) throw new ApiError(400, "invalid  video ID")

 const likes = await Likes.find({ video: videoId }).populate("LikeBy", "username")
 return res.status(200).json(new ApiResponse(200, "Like fetch successfully", likes))
})

export {
 toggleCommentLike,
 toggleTweetLike,
 toggleVideoLike,
 getVideoLike

}