const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const referralController = require("../controllers/referralController");

console.log("Referral Controller:", referralController);

// Direct referrals
router.get(
  "/my",
  authMiddleware,
  referralController.getMyReferrals
);

// Create referral income
router.post(
  "/create",
  authMiddleware,
  referralController.createReferral
);

// Complete referral tree
router.get(
  "/tree",
  authMiddleware,
  referralController.getReferralTree
);

module.exports = router;