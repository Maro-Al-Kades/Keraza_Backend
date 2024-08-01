const mongoose = require("mongoose");
const Joi = require("joi");

//~ DEFINE PROJECT SCHEMA
const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 200,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      minlength: 10,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    image: {
      type: Object,
      required: true,
      default: {
        url: "",
        publicId: null,
      },
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//~ Populate comments for this project
ProjectSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "projectId",
  localField: "_id",
});

//~ PROJECT MODEL
const Project = mongoose.model("Project", ProjectSchema);

//~ CREATE POST VALIDATION
function validateCreateProject(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(5).max(200).required(),
    description: Joi.string().trim().min(10).required(),
    category: Joi.string().trim().required(),
  });
  return schema.validate(obj);
}

//~ UPDATE POST VALIDATION
function validateUpdateProject(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(5).max(200),
    description: Joi.string().trim().min(10),
    category: Joi.string().trim(),
  });
  return schema.validate(obj);
}

module.exports = {
  Project,
  validateCreateProject,
  validateUpdateProject,
};
