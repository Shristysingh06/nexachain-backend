const express = require("express");
const router = express.Router();

const {
  requestWithdraw,
  approveWithdraw,
  rejectWithdraw,
  myWithdraws,
} = require("../controllers/withdrawController");

const { protect, admin } = require("../middleware/authMiddleware");

// 💸 user
router.post("/", protect, requestWithdraw);
router.get("/my", protect, myWithdraws);

// 👑 admin
router.put("/approve/:id", protect, admin, approveWithdraw);
router.put("/reject/:id", protect, admin, rejectWithdraw);

module.exports = router;