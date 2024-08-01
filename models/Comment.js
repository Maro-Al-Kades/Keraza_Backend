const mongoose = require("mongoose");
const Joi = require("joi");

//~ COMMENT SCHEMA
const CommentSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    username: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

//~ COMMENT MODEL
const Comment = mongoose.model("Comment", CommentSchema);

//~ COMMENT VALIDATION

function validateCreateComment(obj) {
  const schema = Joi.object({
    projectId: Joi.string().required().label("رقم المشروع"),
    text: Joi.string().required().trim().max(500).label("النص المكتوب"),
  });
  return schema.validate(obj);
}

function validateUpdateComment(obj) {
  const schema = Joi.object({
    text: Joi.string().required().trim().max(500),
  });
  return schema.validate(obj);
}

module.exports = { Comment, validateCreateComment, validateUpdateComment };
