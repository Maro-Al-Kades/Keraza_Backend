const router = require("express").Router();
const { registerUser, loginUser } = require("../controllers/auth.controller");

//? REGISTER NEW USER => api/auth/register
router.post("/register", registerUser);

//? USER LOGIN => api/auth/login
router.post("/login", loginUser);

module.exports = router;
