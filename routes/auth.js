const express = require("express");
const authController = require("../controllers/authController");
const uploadAvatarToCloudinary = require("../utils/uploadAvatarToCloudinary");
const auth = require("../middleware/auth");

const router = express.Router();

//POST /Register
router.post("/register", authController.registerUser);

//POST /Login
router.post("/login", authController.loginUser);

//POST /Upload Image
router.post(
  "/photo",
  auth.user,
  uploadAvatarToCloudinary,
  authController.uploadAvatarToCloudinary
);

//PATCH /Add Role
router.patch("/role/:id", auth.admin, authController.addRole);

module.exports = router;
