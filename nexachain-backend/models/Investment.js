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
    },

    planDetails: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
    },

    dailyROIPercentage: {
      type: Number,
      required: true,
    },

    totalExpectedReturn: {
      type: Number,
    },

    investmentStatus: {
      type: String,
      enum: ["Active", "Completed", "Cancelled"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Investment", investmentSchema);