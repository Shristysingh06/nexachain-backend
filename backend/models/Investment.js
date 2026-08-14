const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    investmentAmount: {
      type: Number,
      required: true,
      min: 1,
    },

    planDetails: {
      type: String,
      required: true,
    },

    dailyROIPercentage: {
      type: Number,
      required: true,
      default: 1,
    },

    maxDays: {
      type: Number,
      default: 30,
    },

    totalROIEarned: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Completed"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Investment", investmentSchema);