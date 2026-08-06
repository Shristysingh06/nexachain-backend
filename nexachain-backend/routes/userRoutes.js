const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
} = require("../controllers/userController");

const auth = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", auth, async (req, res) => {
  const User = require("../models/User");
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

module.exports = router;