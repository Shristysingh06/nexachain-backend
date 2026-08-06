const express = require("express");
const router = express.Router();

const {
  createInvestment,
  getMyInvestments,
} = require("../controllers/investmentController");

const auth = require("../middleware/authMiddleware");

router.post("/create", auth, createInvestment);
router.get("/my", auth, getMyInvestments);

module.exports = router;