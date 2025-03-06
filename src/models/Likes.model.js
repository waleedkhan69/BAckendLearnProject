import mongoose, { Schema } from "mongoose";


const LikeSchema = new Schema(
 {
  vedio: {
   type: Schema.Types.ObjectId,
   ref: "Video"
  },
  comment: {
   type: Schema.Types.ObjectId,
   ref: "Comment"
  },
  tweet: {
   type: Schema.Types.ObjectId,
   ref: "Tweet"
  },
  likeBy: {
   type: Schema.Types.ObjectId,
   ref: "User"
  }
 },

 { timestamps: true })


export const Likes = mongoose.model("Likes", LikeSchema)