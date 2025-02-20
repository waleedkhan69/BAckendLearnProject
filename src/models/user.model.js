
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
  fullName: {
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
    this.password = await bcrypt.hash(this.password, 10)
  next()
})
userSchema.methods.ispasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {

  jwt.sign({
    _id: this._id,
    email: "",
    userName: this.userName,
    fullNmame: this.fullNmae


  })
}
userSchema.methods.generateRefreshToken = function () { }
export const User = mongoose.model("User", userSchema)