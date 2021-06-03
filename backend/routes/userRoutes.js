const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.get("/confirm/:confirmationCode", authController.confirmationSignup);
router.post("/getUser", authController.getUser);
router.patch(
  "/updateMe",
  authController.uploadProfilePhoto,
  // authController.resizeUserPhoto,
  authController.updateMe
);

router.post("/googleLogin", authController.googleLogin);

module.exports = router;
