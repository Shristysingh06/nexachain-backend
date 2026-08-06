const express = require("express");
const router = express.Router();

const {
  requestWithdraw,
  getMyWithdraws,
  approveWithdraw,
} = require("../controllers/withdrawController");

const auth = require("../middleware/authMiddleware");

// User
router.post("/request", auth, requestWithdraw);
router.get("/my", auth, getMyWithdraws);

// Admin
router.put("/approve/:id", approveWithdraw);

module.exports = router;
