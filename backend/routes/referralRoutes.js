const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

// ✅ correct import
const referralController = require("../controllers/referralController");

// 🔥 DEBUG
console.log("Referral Controller:", referralController);

// ✅ routes
router.get("/my", authMiddleware, referralController.getMyReferrals);

router.post("/create", authMiddleware, referralController.createReferral);

module.exports = router;