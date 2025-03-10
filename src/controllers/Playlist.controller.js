import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const createPlaylist = asyncHandler(async (req, res) => {
 const { name, discription } = req.body
})

const getUserPlaylist = asyncHandler(async (req, res) => {
 const { userId } = req.params
})
const getPlaylistById = asyncHandler(async (req, res) => {
 const { playlistId } = req.params
})

const addVideoToplaylist = asyncHandler(async (req, res) => {
 const { playlistId, videoId } = req.params
})
const deletePlaylist = asyncHandler(async (req, res) => {
 const { videoId } = req.params
})
const updatePlaylist = asyncHandler(async (req, res) => {
 const { playlistId } = req.params
 const { name, discription } = req.params
})

export {
 createPlaylist,
 getUserPlaylist,
 getPlaylistById,
 addVideoToplaylist,
 deletePlaylist,
 updatePlaylist
}
