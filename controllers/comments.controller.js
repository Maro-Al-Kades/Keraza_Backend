const asyncHandler = require("express-async-handler");
const {
  Comment,
  validateCreateComment,
  validateUpdateComment,
} = require("../models/Comment");
const { User } = require("../models/User");

/*
~----------------------------------------------
~ @desk   Create New Comment
~ @route  /api/comments
~ @method POST
~ @access Private (only Logged in user)
~----------------------------------------------
*/
module.exports.createComment = asyncHandler(async (req, res) => {
  const { error } = validateCreateComment(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const profile = await User.findById(req.user.id);

  const comment = await Comment.create({
    projectId: req.body.projectId,
    text: req.body.text,
    user: req.user.id,
    profilePhoto: profile.profilePhoto,
    username: profile.username,
  });

  res.status(201).json(comment);
});

/*
~----------------------------------------------
~ @desk   Get All Comments
~ @route  /api/comments
~ @method GET
~ @access Private (only Admin)
~----------------------------------------------
*/
module.exports.getAllComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find().populate("user");
  res.status(200).json(comments);
});

/*
~----------------------------------------------
~ @desk   Delete Comment
~ @route  /api/comments/:id
~ @method DELETE
~ @access Private (only Admin or The Owner of the Comment)
~----------------------------------------------
*/
module.exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({ message: "التعليق غير موجود" });
  }

  if (req.user.isAdmin || req.user.id === comment.user._id.toString()) {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "تم حذف التعليق بنجاح" });
  } else {
    return res.status(403).json({
      message: "غير مسموح الوصول لهذه المعلومات الا لصاحب الحساب أو المدير",
    });
  }
});

/*
~----------------------------------------------
~ @desk   Update Comment
~ @route  /api/comments/:id
~ @method PUT
~ @access Private (only The Owner of the Comment)
~----------------------------------------------
*/
module.exports.UpdateComment = asyncHandler(async (req, res) => {
  const { error } = validateUpdateComment(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ message: "التعليق غير موجود" });
  }

  if (req.user.id !== comment.user.toString()) {
    return res
      .status(403)
      .json({ message: "غير مسموح الوصول لهذه الصلاحيات الا لصاحب الحساب" });
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        text: req.body.text,
      },
    },
    { new: true }
  );

  res.status(200).json({ message: "تم تحديث التعليق بنجاح", updatedComment });
});
