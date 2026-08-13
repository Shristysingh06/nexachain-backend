const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  invest,
  getMyInvestments,
} = require("../controllers/investmentController");

// Create investment
router.post("/", authMiddleware, invest);

// Get logged-in user's investments
router.get("/my", authMiddleware, getMyInvestments);

// Also support /api/investments
router.get("/", authMiddleware, getMyInvestments);

module.exports = router;