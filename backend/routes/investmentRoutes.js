const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

// ✅ सही import
const {
  createInvestment,
  getMyInvestments,
} = require("../controllers/investmentController");

// ✅ routes
router.post("/", protect, createInvestment);
router.get("/my", protect, getMyInvestments);

module.exports = router;