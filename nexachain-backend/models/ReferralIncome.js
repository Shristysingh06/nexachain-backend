const mongoose = require("mongoose");

const referralIncomeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    referredUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    incomeAmount: Number,
    level: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReferralIncome", referralIncomeSchema);