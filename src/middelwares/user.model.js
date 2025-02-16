
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
 username: {
  type: String,
  unique: true,
  required: true,
  trim: true,
  lowercase: true,
  index: true
 },
 email: {
  type: String,
  unique: true,
  required: true,
  trim: true,
  lowercase: true,

 },
 fullNmae: {
  type: String,
  required: true,
  trim: true,
  index: true
 },
 avater: {
  type: String,
  required: true,
 },
 coverImage: {
  type: String, //cloudinary url
 },
 watchHistory: [
  {
   type: Schema.Types.ObjectId,
   ref: "vedio"
  },
 ],
 password: {
  type: String,
  required: [true, "password is required"]
 },
 refirshToken: {
  type: String
 },

}, { timestamps: true })


userSchema.pre("save", async function (next) {
 if (!this)
  this.password = bcrypt.hash(this.password, 10)
})
const User = mongoose.model("User", userSchema)