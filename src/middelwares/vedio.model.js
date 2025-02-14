import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const vedioSchema = new Schema({
vedioFile:{
 type:String,
 required:true
},
Thumbnail:{
 type:String,
 required:true
},
title:{
 type:String,
 required:true
},
description:{
 type:String,
 required:true
},
duration:{
 type:String,
 required:true
},
views:{
  type:Number,
default:0
},
isPublish:{
 type:Boolean,
 default:true
},
owner:{
 type: Schema.Types.ObjectId,
}
},{timestamps:true})

vedioSchema.plugin(mongooseAggregatePaginate)

export const Vedio = mongoose.model("Vedio",vedioSchema)