const mongoose = require("mongoose");
const Joi = require("joi");

//~ CATEGORY SCHEMA
const CategorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },
  },
  { timestamps: true }
);

//~ Category MODEL
const Category = mongoose.model("Category", CategorySchema);

//~ Category VALIDATION

function validateCreateCategory(obj) {
  const schema = Joi.object({
    title: Joi.string().required().trim().max(100).label("النص المكتوب"),
  });
  return schema.validate(obj);
}

module.exports = { Category, validateCreateCategory };
