import mongoose from "mongoose";
import { DB_Name } from "../constent.js";


const connectDb = async ()=>{
 try {
 const conectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_Name}`)
  console.log(`\n mongo connected sucessfuly BD Host:${conectionInstance.connection.host}`);
  
 } catch (error) {
  console.log("Error is coming",error);
  process.exit(1)
  
 }
}
export default connectDb