const {
  createCategory,
  getAllCategories,
  deleteCategory,
  getSingleCategory,
} = require("../controllers/categories.controller");
const validateObjectId = require("../middlewares/validateObjectId");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

const router = require("express").Router();

//~ api/categories
router
  .route("/")
  .post(verifyTokenAndAdmin, createCategory)
  .get(getAllCategories);

router
  .route("/:id")
  .delete(validateObjectId, verifyTokenAndAdmin, deleteCategory)
  .get(getSingleCategory);

module.exports = router;
