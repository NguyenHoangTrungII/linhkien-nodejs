const express = require("express");
const authController = require("../controllers/authController");
const uploadAvatarToCloudinary = require("../utils/uploadAvatarToCloudinary");
const { user } = require("../middleware/auth");

const router = express.Router();

//POST /Register
router.post("/register", authController.registerUser);

//POST /Login
router.post("/login", authController.loginUser);

//POST /Upload Image
router.post(
  "/photo",
  user,
  uploadAvatarToCloudinary,
  authController.uploadAvatarToCloudinary
);

module.exports = router;
