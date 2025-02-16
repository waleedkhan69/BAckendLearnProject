import mongoose from "mongoose";


const productSchema = mongoose.Schema({
 name: {
  type: String,
  required: true,
  lowercase: true,
  index: true
 },
 price: {
  type: Number,
  required: true,

 },
 id: {
  type: String,
  unique: true,
  required: true
 },
 descri: {
  type: String,
 }



}, { timestamps: true })


export const Product = mongoose.model("Product", productSchema)