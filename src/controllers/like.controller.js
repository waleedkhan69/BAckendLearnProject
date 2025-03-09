import { Likes } from "../models/Likes.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import mongoose, { isValidObjectId } from "mongoose";


const toggleVideoKike = asyncHandler(async (req, res) => {
 const { VideoId } = req.params

})

const toggleCommentLike = asyncHandler(async (req, res) => {
 const { commentId } = req.params
})

const toggleTweetLike = asyncHandler(async (req, res) => {
 const { tweetId } = req.params
})
const gteVideoLike = asyncHandler(async (req, res) => {
 const { videoId } = req.params
})

export {

}