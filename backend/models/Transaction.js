const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String, // deposit / withdraw / referral
      required: true,
    },

    status: {
      type: String,
      default: "pending", // pending / approved / rejected
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);