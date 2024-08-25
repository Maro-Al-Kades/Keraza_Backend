const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "اسم المستخدم مطلوب"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "الايميل مطلوب"],
      trim: true,
      minlength: 5,
      maxlength: 100,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "الرجاء كتابة الايميل بشكل صحيح",
      ],
    },

    password: {
      type: String,
      required: [true, "كلمة السر مطلوبة"],
      trim: true,
      minlength: [8, "اقل احرف هو 8 حروف"],
    },

    profilePhoto: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
    },

    bio: {
      type: String,
      maxlength: 500,
      default: "هذا هو البايو"
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//~ POPULATE PROJECTS THAT BELONGS TO HTIS USER IN PROFILE
UserSchema.virtual("projects", {
  ref: "Project",
  foreignField: "user",
  localField: "_id",
});

//~ GENERATE JWT TOKEN
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

//~ EXPORT
const User = mongoose.model("User", UserSchema);

//~ VALIDATE REGISTER USER
function validateRegisterUser(obj) {
  const schema = Joi.object({
    username: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().min(5).max(100).required().email(),
    password: Joi.string().trim().min(8).required(),
  });

  return schema.validate(obj);
}

//~ VALIDATE USER LOGIN
function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    password: Joi.string().trim().min(8).required(),
  });

  return schema.validate(obj);
}

//~ VALIDATE UPDATE USER
function validateUpdateUser(obj) {
  const schema = Joi.object({
    username: Joi.string().trim().min(2).max(100),
    password: Joi.string().trim().min(8),
    bio: Joi.string().max(500),
  });

  return schema.validate(obj);
}

//~ EXPORT
module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
};
