import mongoose, { isValidObjectId } from "mongoose";
import { Vedio } from "../models/vedio.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getAllVideo = asyncHandler(async (req, res) => {
 const { page = 1, limit = 1, query, sortBy, sortType, userId } = req.query

 const filter = {};
 if (query) filter.title = { $regex: query, $option: "i" }
 if (userId) filter.userId = userId
 const videos = await Vedio.find(filter)
  .sort({ [sortBy]: sortType === "desc" ? -1 : 1 })
  .skip((page - 1) * limit)
  .limit(Number(limit))
 res.status(200).json(new ApiResponse(200, "Videos fetched successfully"))

})

const publishVideo = asyncHandler(async (req, res) => {
 const { title, description } = req.body

 if (!title || !description) {
  throw new ApiError(400, "title and description is required")
 }
 const newVideo = await Vedio.create({ title, description, userId: req.user.id })
 res.status(200).json(new ApiResponse(200, "vedio published successfully"))
})


const getVideoById = asyncHandler(async (req, res) => {
 const { videoId } = req.params
 const userId = req.user.id
 if (!isValidObjectId(videoId)) throw new ApiError(400, "user video ID is invalid")
 const vedio = await Vedio.findById(videoId)
 if (!vedio) {
  throw new ApiError(404, "video not found")
 }
 res.status(200).json(new ApiResponse(200, "video details fetched successfully"))
})
const updateVideo = asyncHandler(asyncHandler(async (req, res) => {
 const { videoId } = req.params
 const { title, description } = req.body

 if (!isValidObjectId(videoId)) throw new ApiError(400, "invalid video ID")

 const updateVideo = await Vedio.findByIdAndUpdate(videoId, { title, description }, { new: true, runValidators: true })
 if (!updateVideo) {
  throw new ApiError(404, "video not found")
 }
 res.status(200).json(new ApiResponse(200, "video update successfully"))

}))

const deleteVideo = asyncHandler(async (req, res) => {
 const { videoId } = req.params
 if (!isValidObjectId) throw new ApiError(400, "invalid video ID")
 const deleteVideo = await Vedio.findByIdAndDelete(videoId)
 if (!deleteVideo) {
  throw new ApiError(400, "video not found")
 }
 res.status(200).json(new ApiResponse(200, "video delete successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
 const { videoId } = req.params
 if (!isValidObjectId(videoId)) throw new ApiError(400, "invalid video ID")
 const vedio = await Vedio.findById(videoId)
 if (!vedio) {
  throw new ApiError(404, "video not found")
 }
 vedio.published = !vedio.published
 await vedio.save()

 res.status(200).json(new ApiResponse(200, "video published successfully"))
})

export {
 getAllVideo,
 publishVideo,
 getVideoById,
 updateVideo,
 deleteVideo,
 togglePublishStatus
}