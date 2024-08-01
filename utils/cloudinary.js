const cloudinary = require("cloudinary").v2; // تأكد من استخدام النسخة الصحيحة

//` CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//` CLOUDINARY UPLOAD IMAGE FN
const cloudinaryUploadImage = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("خطأ في السيرفر (cloudinary)");
  }
};

//` CLOUDINARY REMOVE IMAGE FN
const cloudinaryRemoveImage = async (imagePublicId) => {
  try {
    const result = await cloudinary.uploader.destroy(imagePublicId); // تم تصحيح الخطأ هنا
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("خطأ في السيرفر (cloudinary)");
  }
};

//` CLOUDINARY REMOVE Multiple IMAGE FN
const cloudinaryRemoveMultiImage = async (publicIds) => {
  try {
    const result = await cloudinary.v2.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("خطأ في السيرفر (cloudinary)");
  }
};

module.exports = {
  cloudinaryRemoveImage,
  cloudinaryUploadImage,
  cloudinaryRemoveMultiImage,
};
