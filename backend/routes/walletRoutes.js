const express = require("express");
const router = express.Router();

// ✅ middleware
const authMiddleware = require("../middleware/authMiddleware");

// ✅ controller (IMPORTANT destructure)
const walletController = require("../controllers/walletController");

// 🔥 DEBUG (check function aa raha ya nahi)
console.log("Wallet Controller:", walletController);

// ✅ route
router.get("/", authMiddleware, walletController.getWallet);

module.exports = router;