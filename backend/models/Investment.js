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

    // ✅ ROI TRACKING
    totalEarned: {
      type: Number,
      default: 0,
    },

    daysCompleted: {
      type: Number,
      default: 0,
    },

    maxDays: {
      type: Number,
      default: 30,
    },

    investmentStatus: {
      type: String,
      enum: ["Active", "Completed", "Cancelled"],
      default: "Active",
    },
  },
  { timestamps: true }
);

// ✅ AUTO CALCULATE
investmentSchema.pre("save", function (next) {
  if (!this.totalExpectedReturn) {
    this.totalExpectedReturn =
      (this.investmentAmount * this.dailyROIPercentage * this.maxDays) / 100;
  }

  // ✅ auto endDate
  if (!this.endDate) {
    const end = new Date(this.startDate);
    end.setDate(end.getDate() + this.maxDays);
    this.endDate = end;
  }

  next();
});

module.exports = mongoose.model("Investment", investmentSchema);