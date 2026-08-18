const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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
      min: 0,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      required: true,
    },

    maxDays: {
      type: Number,
      default: 30,
      min: 1,
    },

    totalROIEarned: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Completed", "Cancelled"],
      default: "Active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Investment", investmentSchema);