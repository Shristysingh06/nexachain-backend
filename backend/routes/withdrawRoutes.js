const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

// ✅ correct import
const withdrawController = require("../controllers/withdrawController");

// 🔥 DEBUG
console.log("Withdraw Controller:", withdrawController);

// ✅ routes
router.post("/request", authMiddleware, withdrawController.requestWithdraw);

router.get("/my", authMiddleware, withdrawController.getMyWithdrawals);

module.exports = router;