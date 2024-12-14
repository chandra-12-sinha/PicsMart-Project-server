

const {
  signupController,
  loginController,
  refreshAccessTokenController,
  logOutController,
} = require("../../contollers/auth.Controller");

const router = require("express").Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/refreshtoken", refreshAccessTokenController);
router.delete("/", logOutController);

  module.exports = router;
