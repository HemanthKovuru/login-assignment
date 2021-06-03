const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Firstname is required."],
    trim: true,
    minlength: 3,
  },
  lastname: {
    type: String,
    required: [true, "Lastname is required."],
    trim: true,
  },
  username: {
    type: String,
    required: [true, "Username is required."],
    trim: true,
    unique: true,
    minlength: 3,
    maxlength: 30,
  },
  profilePic: {
    type: String,
    default: "default.jpg",
  },
  wallPic: {
    type: String,
    default: "wall.jpg",
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide your email."],
    trim: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, "Please provide your password."],
    trim: true,
  },
  confirmPassword: {
    type: String,
    minlength: 8,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Passowrd does not match.",
    },
  },
  confirmationCode: {
    type: String,
    unique: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Active"],
    default: "Pending",
  },
});

// document middleware
// hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;

  next();
});

// methods
// check passwords match
userSchema.methods.checkPassword = async function (inputPass, dbPass) {
  return await bcrypt.compare(inputPass, dbPass);
};

const user = mongoose.model("User", userSchema);
module.exports = user;
