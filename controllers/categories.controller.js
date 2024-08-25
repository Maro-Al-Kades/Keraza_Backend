const asyncHandler = require("express-async-handler");
const { Category, validateCreateCategory } = require("../models/Category");
const { Project } = require("../models/Project");
const { default: mongoose } = require("mongoose");

/*
~----------------------------------------------
~ @desk   Create New Category
~ @route  /api/categories
~ @method POST
~ @access Private (only Admin)
~----------------------------------------------
*/
module.exports.createCategory = asyncHandler(async (req, res) => {
  //~ 01- VALIDATION
  const { error } = validateCreateCategory(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const category = await Category.create({
    title: req.body.title,
    user: req.user.id,
  });

  res.status(201).json({ message: "تم انشاء القسم بنجاح", category });
});

/*
~----------------------------------------------
~ @desk   Get All Categories
~ @route  /api/categories
~ @method GET
~ @access Public
~----------------------------------------------
*/
module.exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().select("-__v");

  res.status(200).json({ message: "تم جلب البيانات بنجاح", categories });
});

/*
~----------------------------------------------
~ @desk   Get Single Project
~ @route  /api/categories
~ @method GET
~ @access Public
~----------------------------------------------
*/

module.exports.getSingleCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;

  // تحقق من صحة المعرف
  if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({ message: 'معرف غير صالح' });
  }

  const singleCategory = await Category.findById(categoryId).select('-__v');

  if (!singleCategory) {
    return res.status(404).json({ message: 'الفئة غير موجودة' });
  }

  const projects = await Project.find({ category: singleCategory.title }).select('-__v');

  res.status(200).json({
    message: 'تم جلب البيانات بنجاح',
    singleCategory,
    projects,
  });
});
/*
~----------------------------------------------
~ @desk   Delete Category
~ @route  /api/categories/:id
~ @method DELETE
~ @access Private (only Admin)
~----------------------------------------------
*/
module.exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "القسم غير موجود" });
  }

  const deletedCategory = await Category.findByIdAndDelete(
    req.params.id
  ).select("-__v");

  res.status(200).json({ message: "تم حذف القسم بنجاح", deletedCategory });
});
