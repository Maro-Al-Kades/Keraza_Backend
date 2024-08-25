const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../models/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const {
  cloudinaryRemoveImage,
  cloudinaryUploadImage,
  cloudinaryRemoveMultiImage,
} = require("../utils/cloudinary");
const { Comment } = require("../models/Comment");
const { Project } = require("../models/Project");

//` ============ GET ALL USERS PROFILES [ /users/profiles, ONLY ADMIN ] ============
module.exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).populate("projects");
  res.status(200).json({ message: "تم الحصور علي البيانات بنجاح", users });
});

//` ============ GET SINGLE USER PROFILE [ /users/profile/:id ] ============
module.exports.getSingleUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .select("-__v")
    .select("-updatedAt")
    .populate("projects");

  if (!user) {
    return res.status(404).json({ message: "المستخدم غير موجود" });
  }

  res.status(200).json(user);
});

//` ============ UPDATE USER PROFILE [ /users/profile/:id, ONLY USER HIMSELF ] ============
module.exports.updateUserProfile = asyncHandler(async (req, res) => {
  //~ 01- VALIDATION
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  //~ 02- HASH THE NEW PASSWORD
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  //~ 03- UPDATE THE USER INFO
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio,
      },
    },
    { new: true }
  )
    .select("-password")
    .select("-__v")
    .populate("projects")

  res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح", updatedUser });
});

//` ============ GET USERS COUNT [ /users/count, ONLY ADMIN ] ============
module.exports.getUsersCount = asyncHandler(async (req, res) => {
  const count = await User.countDocuments();
  res.status(200).json({ message: "تم الحصور علي البيانات بنجاح", count });
});

//` ============ UPLOAD PROFILE PHOTO [ /users/profile/upload-profile-photo, ONLY LOGGED IN USER ] ============
module.exports.uploadProfilePhoto = asyncHandler(async (req, res) => {
  //~ 01- VALIDATION
  if (!req.file) {
    return res.status(400).json({ message: "لم يتم رفع الصورة" });
  }

  //~ 02- GET THE IMAGE PATH
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  //~ 03- UPLOAD TO CLOUDINARY.
  const result = await cloudinaryUploadImage(imagePath);
  console.log(result);

  //~ 04- GET THE USER FROM DB
  const user = await User.findById(req.user.id);

  //~ 05- DELETE THE OLD PROFILE PHOTO IF EXISTS
  if (user.profilePhoto.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  //~ 06- CHANGE THE PROFILE PHOTO IN THE DB
  user.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
  };

  //~ 07- SAVE THE UPDATED USER TO DB
  await user.save();

  //~ 08- SEND RESPONSE TO THE CLIENT
  res.status(200).json({
    message: "تم رفع الصورة بنجاح",
    profilePhoto: { url: result.secure_url, publicId: result.public_id },
  });

  //~ 09- REMOVE THE IMAGE FROM THE SERVER
  fs.unlinkSync(imagePath);
});

//` ============ DELETE USER PROFILE [ /users/profile/:id, ONLY LOGGED IN USER + ADMIN ] ============
module.exports.deleteUserProfile = asyncHandler(async (req, res) => {
  //~ 01- GET THE USER FROM DB
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "لا يوجد مستخدم" });
  }

  //~ 02- GET ALL PROJECTS FROM DB
  const projects = await Project.find({ user: user._id });

  //~ 03- GET THE PUBLIC IDS FROM THE PROJECTS
  const publicIds = projects?.map((project) => project.image.publicId);

  //~ 04- DELETE ALL PROJECTS IMAGES FROM CLOUDINARY THAT USER HAVE
  if (publicIds?.length > 0) {
    await cloudinaryRemoveMultiImage(publicIds);
  }

  //~ 05- DELETE THE PROFILE PIC FROM CLOUDINARY
  if (user.profilePhoto.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  //~ 06- DELETE USER PROJECTS AND COMMENTS
  await Project.deleteMany({ user: user._id });
  await Comment.deleteMany({ user: user._id });

  //~ 07- DELETE THE USER HIMSELF
  await User.findByIdAndDelete(req.params.id);

  //~ 08- SEND RESPONSE TO THE CLIENT
  res.status(200).json({ message: "تم حذف الحساب الشخصي بنجاح" });
});
