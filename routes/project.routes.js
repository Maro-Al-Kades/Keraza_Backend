const {
  createProject,
  getAllProjects,
  getSingleProject,
  getProjectsCount,
  deleteProject,
  updateProject,
  updateProjectImage,
  toggleLike,
} = require("../controllers/projects.controller");
const photoUpload = require("../middlewares/photoUpload");
const { verifyToken } = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");

const router = require("express").Router();

//~ api/projects
router
  .route("/")
  .post(verifyToken, photoUpload.single("image"), createProject)
  .get(getAllProjects);

//~ api/projects/count
router.route("/count").get(getProjectsCount);

//~ api/projects/:id
router
  .route("/:id")
  .get(validateObjectId, getSingleProject)
  .delete(validateObjectId, verifyToken, deleteProject)
  .put(validateObjectId, verifyToken, updateProject);

//~ api/projects/update-image/:id
router
  .route("/update-image/:id")
  .put(
    validateObjectId,
    verifyToken,
    photoUpload.single("image"),
    updateProjectImage
  );

//~ api/projects/like/:id
router.route("/like/:id").put(validateObjectId, verifyToken, toggleLike);

module.exports = router;
