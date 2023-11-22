const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email is invalid");
        }
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: 6,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password should not contain word: password");
        }
      },
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "staff", "accountant", "admin", "manager"],
    },
    phone: {
      type: String,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isMobilePhone(value)) {
          throw new Error("Phone is invalid");
        }
      },
    },
    gender: {
      type: String,
      enum: ["Nam", "Nữ"],
    },
    address: {
      type: String,
    },
    birthday: {
      type: Date,
    },
    imageurl: {
      type: String,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  if (!userObject.role === "admin") {
    delete userObject.updatedAt;
    delete userObject.__v;
  }
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "mySecret");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error("Unable to login");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Unable to login");

  return user;
};

userSchema.methods.updateAvatar = async function (newAvatarUrl) {
  const user = this;
  user.imageurl = newAvatarUrl;
  await user.save();
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcryptjs.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
