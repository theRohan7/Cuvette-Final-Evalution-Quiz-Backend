import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
})


const uploadOnCloudinary = async (localFilePath) => {
    
    try {
        if(!localFilePath) return console.error("could not find file path :( ");
    
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
    
        console.log("File is uploaded on Cloudinary: ", response.url);
        
        return response; 
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
        
    }
}

export { uploadOnCloudinary }