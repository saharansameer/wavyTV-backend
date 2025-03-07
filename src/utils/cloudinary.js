import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath, resourceType, folderName) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
      folder: folderName
    });

    // Removes files from public/temp directory after uploading to cloudinary
    fs.unlinkSync(localFilePath);

    return response;
  } catch (err) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const destroyAssetFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "auto",
      invalidate: true
    });
    return true;
  } catch (err) {
    return null;
  }
};

export { uploadOnCloudinary, destroyAssetFromCloudinary };
