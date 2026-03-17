const cloudinary = require("../config/cloudinary");

// helper method to upload image to cloudinary
const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (err) {
    console.error("Error while uploading to cloudinary", err);
    throw new Error("Error while uploading to cloudinary");
  }
};

// helper method to delete image from cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);  
  } catch (err) {
    console.error("Error while deleting from cloudinary", err);
    throw new Error("Error while deleting from cloudinary");
  }
};


module.exports = { uploadToCloudinary, deleteFromCloudinary };
