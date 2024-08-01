const path = require("path");
const multer = require("multer");

//` PHOTO STORAGE
const PhotoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    if (file) {
      cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    } else {
      cb(null, false);
    }
  },
});

//` PHOTO UPLOAD MIDDLEWARE
const photoUpload = multer({
  storage: PhotoStorage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb({ message: "ملف غير مدعوم" }, false);
    }
  },

  limits: { fileSize: 1024 * 1024 * 3 }, //* 3 MB
});

module.exports = photoUpload;
