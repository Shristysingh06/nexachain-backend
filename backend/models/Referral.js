const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    // User who receives the referral income
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // User who generated the income
    referredUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Referral level
    level: {
      type: Number,
      required: true,
      min: 1,
    },

    // Referral income amount
    incomeAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Date of income
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate referral income for the same
// receiver + generated user + level + date
referralSchema.index(
  {
    user: 1,
    referredUser: 1,
    level: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Referral", referralSchema);