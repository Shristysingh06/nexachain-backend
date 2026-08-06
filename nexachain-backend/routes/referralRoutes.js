const express = require("express");
const router = express.Router();

const {
  createReferralIncome,
  getReferralIncome,
} = require("../controllers/referralController");

router.post("/", createReferralIncome);
router.get("/", getReferralIncome);

module.exports = router;
module.exports = router;