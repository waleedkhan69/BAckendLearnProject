// require ('env').confige({path:'./env'})
import dotenv from "dotenv"

import mongoose from "mongoose";

import { DB_Name } from "./constent.js";
import connectDb from "./db/index.js";
dotenv.config({
 path:"./env"
})






connectDb()
















// import express from "express"
// const app = express()


// (async ()=>{
//  try {
//   const mogoDB = await mongoose.connect(`${process.env.MONGO_URI}/${ DB_Name}`)
//   app.on("error",(error)=>{
//    console.log("error ",error);
//    throw error
   
//   })
//  app.listen(process.env.PORT,()=>{
//   console.log(`app is runing on port ${process.env.PORT}`);
  
//  })
//  } catch (error) {
//   console.log("server eror",error);
//   throw error
  
//  }
// })