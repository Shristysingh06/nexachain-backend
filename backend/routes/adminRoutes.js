const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllInvestments,
  getAllWithdraws,
  approveWithdraw,
  rejectWithdraw,
} = require("../controllers/adminController");

const { protect, admin } = require("../middleware/authMiddleware");

// ================= 👥 USERS =================
router.get("/users", protect, admin, getAllUsers);

// ================= 💰 INVESTMENTS =================
router.get("/investments", protect, admin, getAllInvestments);

// ================= 💸 WITHDRAWS =================
router.get("/withdraws", protect, admin, getAllWithdraws);

// ================= ✅ APPROVE =================
router.put("/withdraw/approve/:id", protect, admin, approveWithdraw);

// ================= ❌ REJECT =================
router.put("/withdraw/reject/:id", protect, admin, rejectWithdraw);

module.exports = router;