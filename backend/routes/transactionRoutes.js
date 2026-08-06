const express = require("express");
const router = express.Router();

const {
  withdraw,
  getTransactions,
} = require("../controllers/transactionController");

const auth = require("../middleware/authMiddleware");

router.post("/withdraw", auth, withdraw);
router.get("/history", auth, getTransactions);

module.exports = router;