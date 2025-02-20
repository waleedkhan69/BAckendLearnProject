import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
 cloud_Name: process.env.CLOUDINARY_CLOUD_NAME,
 api_key: process.env.CLOUDINARY_API_KEY,
 api_secret: process.env.CLOUDINARY_API_SCRIPT
})

const UploadOnCloudinary = async (filePath) => {

 try {
  if (!filePath) return null
  const response = await cloudinary.uploader.upload(filePath, {
   resource_type: "auto"
  })
  console.log("file upload successfuly",
   response.url
  );
  return response


 } catch (error) {
  fs.unlinkSync(filePath)
  return null

 }

}




// cloudinary.v2.uploader.("/home/my_image.jpg", { upload_preset: "my_preset" }, (error, result) => {
//  console.log(result, error);
// });

export { UploadOnCloudinary }