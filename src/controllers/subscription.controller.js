import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model"

const toggleSubscription = asyncHandler(async (req, res) => {
 const { channelID } = req.params
})
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
 const { channelID } = req.params
})

const getSubscribeChannel = asyncHandler(async (req, res) => {
 const { subscribId } = req.params
})

export {
 getUserChannelSubscribers,
 getUserChannelSubscribers,
 getSubscribeChannel
}