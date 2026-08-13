const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getDashboard,
} = require("../controllers/userController");

// Auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// Dashboard
router.get("/dashboard", authMiddleware, getDashboard);

module.exports = router;