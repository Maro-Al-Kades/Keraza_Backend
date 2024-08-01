const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const {
  Project,
  validateCreateProject,
  validateUpdateProject,
} = require("../models/Project");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
const { Comment } = require("../models/Comment");

/*
~----------------------------------------------
~ @desk   Create New Project
~ @route  /api/projects/
~ @method POST
~ @access only Logged In User
~----------------------------------------------
*/
module.exports.createProject = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "لم يتم رفع اي صورة" });
  }

  const { error } = validateCreateProject(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  const project = await Project.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    user: req.user.id,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  res.status(201).json(project);

  fs.unlinkSync(imagePath);
});

/*
~----------------------------------------------
~ @desk   Get All Projects
~ @route  /api/projects
~ @method GET
~ @access Public
~----------------------------------------------
*/
module.exports.getAllProjects = asyncHandler(async (req, res) => {
  const PROJECT_PER_PAGE = 6;

  const { pageNumber, category } = req.query;

  let projects;
  if (pageNumber) {
    projects = await Project.find()
      .skip((pageNumber - 1) * PROJECT_PER_PAGE)
      .limit(PROJECT_PER_PAGE)
      .sort({ createdAt: -1 })
      .populate("user", ["-password", "-__v"]);
  } else if (category) {
    projects = await Project.find({ category }).populate("user", [
      "-password",
      "-__v",
    ]);
  } else {
    projects = await Project.find()
      .sort({ createdAt: -1 })
      .populate("user", ["-password", "-__v"]);
  }

  res.status(200).json(projects);
});

/*
~----------------------------------------------
~ @desk   Get Single Project
~ @route  /api/projects/:id
~ @method GET
~ @access Public
~----------------------------------------------
*/
module.exports.getSingleProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("user", ["-password", "-__v"])
    .populate("comments");
  if (!project) {
    return res.status(404).json({ message: "لم يتم العثور علي المشروع" });
  }
  res.status(200).json({ connection: "Success", project });
});

/*
~----------------------------------------------
~ @desk   Get Projects Count
~ @route  /api/projects/count
~ @method GET
~ @access Public
~----------------------------------------------
*/
module.exports.getProjectsCount = asyncHandler(async (req, res) => {
  const count = await Project.countDocuments();

  res.status(200).json(count);
});

/* 
~----------------------------------------------
~ @desk   Delete Single Project
~ @route  /api/projects/:id
~ @method DELETE
~ @access Only Admin or the Owner of the Project
~----------------------------------------------
 */
module.exports.deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "لم يتم العثور علي المشروع" });
  }

  if (req.user.isAdmin || req.user.id === project.user.toString()) {
    await Project.findByIdAndDelete(req.params.id);
    await cloudinaryRemoveImage(project.image.publicId);

    //~ Delete All Comments of the Project
    await Comment.deleteMany({ projectId: project._id });

    res
      .status(200)
      .json({ message: "تم حذف المشروع بنجاح", projectId: project._id });
  } else {
    res.status(403).json({ message: "غير مسموح بحذف المشروع" });
  }
});

/* 
~----------------------------------------------
~ @desk   Update Project
~ @route  /api/projects/:id
~ @method PUT
~ @access Private [Only Owner of the Project]
~----------------------------------------------
 */
module.exports.updateProject = asyncHandler(async (req, res) => {
  const { error } = validateUpdateProject(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const project = await Project.findByIdAndUpdate(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "لم يتم العثور علي المشروع" });
  }

  if (req.user.id !== project.user.toString()) {
    return res.status(403).json({ message: "غير مسموح التعديل علي المشروع" });
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
      },
    },
    { new: true }
  ).populate("user", ["-password", "-__v"]);

  res.status(200).json({ message: "تم تحديث المشروع بنجاح", updatedProject });
});

/* 
~----------------------------------------------
~ @desk   Update Project Image
~ @route  /api/projects/upload-image/:id
~ @method PUT
~ @access Private [Only Owner of the Project]
~----------------------------------------------
 */
module.exports.updateProjectImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "لم يتم الحصول علي اي صورة" });
  }

  const project = await Project.findByIdAndUpdate(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "لم يتم العثور علي المشروع" });
  }

  if (req.user.id !== project.user.toString()) {
    return res.status(403).json({ message: "غير مسموح التعديل علي المشروع" });
  }

  // ~ Remove old image from cloudinary
  await cloudinaryRemoveImage(project.image.publicId);

  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  // ~ Update image filed in db
  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        image: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      },
    },
    { new: true }
  );

  res.status(200).json({ message: "تم تغيير الصورة بنجاح", updatedProject });

  // ~ Remove image from the server
  fs.unlinkSync(imagePath);
});

/* 
~----------------------------------------------
~ @desk   Toggle Like
~ @route  /api/projects/like/:id
~ @method PUT
~ @access Private [Only Logged in user]
~----------------------------------------------
 */
module.exports.toggleLike = asyncHandler(async (req, res) => {
  const loggedInUser = req.user.id;
  const { id: projectId } = req.params;

  let project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: "لم يتم العثور علي المشروع" });
  }

  const isProjectAlreadyLiked = project.likes.find(
    (user) => user.toString() === loggedInUser
  );

  if (isProjectAlreadyLiked) {
    project = await Project.findByIdAndUpdate(
      projectId,
      {
        $pull: { likes: loggedInUser },
      },
      { new: true }
    );
  } else {
    project = await Project.findByIdAndUpdate(
      projectId,
      {
        $push: { likes: loggedInUser },
      },
      { new: true }
    );
  }

  res.status(200).json(project);
});
