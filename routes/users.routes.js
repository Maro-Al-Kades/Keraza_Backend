const router = require("express").Router();
const {
  getAllUsers,
  getSingleUser,
  updateUserProfile,
  getUsersCount,
  uploadProfilePhoto,
  deleteUserProfile,
} = require("../controllers/users.controller");
const photoUpload = require("../middlewares/photoUpload");
const validateObjectId = require("../middlewares/validateObjectId");
const {
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyToken,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");

//~ ======== /api/users/profiles ========
router.route("/profiles").get(verifyTokenAndAdmin, getAllUsers);

//~ ======== /api/users/count ========
router.route("/count").get(verifyTokenAndAdmin, getUsersCount);

//~ ======== /api/users/profile/:id ========
router
  .route("/profile/:id")
  .get(validateObjectId, getSingleUser)
  .put(validateObjectId, verifyTokenAndOnlyUser, updateUserProfile)
  .delete(validateObjectId, verifyTokenAndAuthorization, deleteUserProfile);

//~ ======== /api/users/profile/upload-profile-photo ========
router
  .route("/profile/upload-profile-photo")
  .post(verifyToken, photoUpload.single("image"), uploadProfilePhoto);

module.exports = router;
