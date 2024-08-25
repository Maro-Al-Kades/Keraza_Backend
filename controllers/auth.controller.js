const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/User");

//~ ============ REGISTER NEW USER ============

module.exports.registerUser = asyncHandler(async (req, res) => {
  //~ 01- VALIDATION
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  //~ 02- IS USER ALREADY REGISTERED
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "المستخدم موجود بالفعل" });
  }

  //~ 03- HASH THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //~ 04- ADD NEW USER AND SAVE IT IN DB
  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  await user.save();

  //! TODO: VERIFY ACCOUNT

  //~ 05- SEND RES TO CLIENT
  res
    .status(201)
    .json({ message: "تم التسجيل بنجاح, من فضلك سجل الدخول", user });
});

//~ ============ USER LOGIN ============

module.exports.loginUser = asyncHandler(async (req, res) => {
  // ~ 01- VALIDATION
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // ~ 02- IS USER EXIST
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "خطأ في الايميل او كلمة المرور" });
  }

  // ~ 03- CHECK THE PASSWORD
  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isPasswordMatch) {
    return res.status(400).json({ message: "خطأ في  كلمة المرور" });
  }

  // ~ 04- GENERATE JWT TOKEN
  const token = user.generateAuthToken();

  // ~ 05- SEND RES TO CLIENT with username included
  res.status(200).json({
    _id: user._id,
    isAdmin: user.isAdmin,
    profilePhoto: user.profilePhoto,
    token,
    username: user.username,
  });
});
