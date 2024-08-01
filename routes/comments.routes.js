const {
  createComment,
  getAllComments,
  deleteComment,
  UpdateComment,
} = require("../controllers/comments.controller");
const validateObjectId = require("../middlewares/validateObjectId");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

const router = require("express").Router();

//~ api/comments
router
  .route("/")
  .post(verifyToken, createComment)
  .get(verifyTokenAndAdmin, getAllComments);

//~ api/comments/:id
router
  .route("/:id")
  .delete(validateObjectId, verifyToken, deleteComment)
  .put(validateObjectId, verifyToken, UpdateComment);

module.exports = router;
