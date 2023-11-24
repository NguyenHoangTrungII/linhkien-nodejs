const User = require("../models/user");
const bcrypt = require("bcrypt");

const authController = {
  //REGISTER
  registerUser: async (req, res) => {
    try {
      const {
        username,
        password,
        name,
        email,
        phone,
        role,
        gender,
        address,
        birthday,
      } = req.body;
      const userExists = await User.findOne({ username });
      const emailExists = await User.findOne({ email });
      const phoneExists = await User.findOne({ phone });

      if (role)
        return res.status(409).json({ error: "You cannot set role property." });
      if (userExists)
        return res.status(409).json({ error: "User already exists" });
      if (emailExists)
        return res.status(409).json({ error: "This email has been used" });
      if (phoneExists)
        return res
          .status(409)
          .json({ error: "This phone number has been used" });

      const newUser = new User({
        username,
        password,
        name,
        email,
        phone,
        gender,
        address,
        birthday,
      });
      await newUser.save();
      res.status(201).json({ message: "User created successfully" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: e.message });
    }
  },

  //LOGIN
  loginUser: async (req, res) => {
    try {
      const user = await User.findByCredentials(
        req.body.username,
        req.body.password
      );
      const token = await user.generateAuthToken();
      res.status(201).json({ user, token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: "Wrong username or password" });
    }
  },

  // logout user
  logoutUser: async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token;
      });

      await req.user.save();
      res.status(200).json({ message: "Logged out" });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  uploadAvatarToCloudinary: async (req, res) => {
    const userId = req.body.userId;
    const avatarUrl = req.avatarUrl;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await user.updateAvatar(avatarUrl);

      res.status(200).json({ avatarUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Lỗi khi cập nhật avatar" });
    }
  },
  // add role (only admin allowed)
  addRole: async (req, res) => {
    try {
      const { user } = req;
      if (user.role !== "admin") {
        return res
          .status(403)
          .json({ error: "Access denied. Only admins can add roles." });
      }
      const _id = req.params.id;
      const allowedUpdates = ["role"];
      const updates = Object.keys(req.body);
      const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
      );
      if (!isValidOperation) {
        return res.status(400).json({ error: "Invalid update" });
      }
      const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
        new: true,
      });
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(updatedUser);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  },
};

module.exports = authController;
