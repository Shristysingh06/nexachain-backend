const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    mobile: { type: String, required: true },

    password: { type: String, required: true },

    referralCode: {
      type: String,
      unique: true,
    },

    referredBy: {
      type: String,
    },

    walletBalance: {
      type: Number,
      default: 0,
    },

    totalROI: {
      type: Number,
      default: 0,
    },

    totalLevelIncome: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);