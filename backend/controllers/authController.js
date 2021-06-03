const jwt = require("jsonwebtoken");
const sendConfirmationEmail = require("./../utils/email");
const User = require("./../models/userModel");
const multer = require("multer");
const sharp = require("sharp");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcryptjs");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// create token
const getToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
// create and send token
const sendToken = (user, statusCode, res) => {
  const token = getToken(user._id);

  let cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_EXPIRES_IN + 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }
  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// signup
exports.signup = async (req, res, next) => {
  try {
    const token = jwt.sign(
      { email: "hemanthkovuruk3@gmail.com" },
      process.env.JWT_SECRET
    );

    const user = await User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      profilePic: req.body.profilePic,
      WallPic: req.body.WallPic,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      confirmationCode: token,
    });

    user.save((err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      res.status(200).json({
        status: "success",
        data: {
          message:
            "User was registered successfully! Please check your email for confirmation",
          user,
        },
      });

      sendConfirmationEmail(req.body.username, req.body.email, token);
    });
  } catch (err) {
    res.status(400).json({
      errors: err.errors,
    });
  }
};

// google login
exports.googleLogin = async (req, res) => {
  const response = await client.verifyIdToken({
    idToken: req.body.tokenId,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { email_verified, email, given_name, family_name, picture } =
    response.payload;
  if (email_verified) {
    const user = await User.findOne({ email });
    if (user) {
      sendToken(user, 200, res);
    } else {
      try {
        const password = await bcrypt.hash(email, 12);
        const user = await User.create({
          firstname: given_name,
          lastname: family_name,
          username: given_name + family_name + new Date().getMilliseconds(),
          email,
          profilePic: picture,
          password,
          status: "Active",
        });
        sendToken(user, 200, res);
      } catch (err) {
        res.status(400).json({
          status: "fail",
          err: err.message,
        });
      }
    }
  }
};

exports.signin = async (req, res, next) => {
  // check if there is email and password
  try {
    const { password, email } = req.body;
    if (!password || !email) {
      res.status(400).json({ message: "Please provide email and password" });
      return next();
    }

    // check if user exists and password is correct
    const user = await User.findOne({ email });
    if (user.status === "Pending") {
      res.status(400).json({
        message: "Your Account is Pending. Please verify your email address",
      });
      return next();
    }

    if (!user || !(await user.checkPassword(password, user.password))) {
      res.status(400).json({ message: "Incorrect  email or password" });
      return next();
    }
    user.password = undefined;
    user.__v = undefined;
    // send data

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(200).json({
      status: "fail",
      err,
    });
  }
  // sendToken(user, 200, res);
};

exports.confirmationSignup = async (req, res) => {
  try {
    const user = await User.findOne({
      confirmationCode: req.params.confirmationCode,
    });
    if (!user) {
      res.status(404).json({
        message: "user not found",
      });
    } else {
      user.status = "Active";
      user.confirmationCode = undefined;
      await user.save();
      const token = getToken(user._id);

      let cookieOptions = {
        expiresIn: new Date(
          Date.now() + process.env.JWT_EXPIRES_IN + 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };

      if (process.env.NODE_ENV === "production") {
        cookieOptions.secure = true;
      }
      res.cookie("jwt", token, cookieOptions);
      res.redirect("/");
    }
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      status: "Active",
    });
    if (!user) {
      res.status(404).json({
        message: "user not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
};

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Please upload images only."), false);
  }
};

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/profilePic");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${Date.now()}.${ext}`);
  },
});

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProfilePhoto = upload.single("profilePic");

// image update
exports.updateMe = async (req, res) => {
  console.log(req.file.filename);
  // 60b89d96fc600338401ff16e
  // 3). update the user document
  const user = await User.findByIdAndUpdate(
    "60b89d96fc600338401ff16e",
    { profilePic: req.file.filename },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};
