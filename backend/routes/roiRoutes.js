const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

// ✅ correct import
const roiController = require("../controllers/roiController");

// 🔥 DEBUG
console.log("ROI Controller:", roiController);

// ✅ routes
router.get("/my", authMiddleware, roiController.getMyROI);

module.exports = router;