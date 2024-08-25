const cloudinary = require("cloudinary"); // تأكد من استخدام النسخة الصحيحة

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
    const result = await cloudinary.uploader.destroy(imagePublicId);
    console.log('Cloudinary result:', result); // تسجيل النتيجة للحصول على تفاصيل أكثر
    if (result.result !== 'ok') {
      throw new Error(`Failed to remove image: ${result.result}`);
    }
    return result;
  } catch (error) {
    console.log('Error removing image from Cloudinary:', error);
    throw new Error("خطأ في السيرفر (cloudinary)");
  }
};
//` CLOUDINARY REMOVE Multiple IMAGE FN
const cloudinaryRemoveMultiImage = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
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
