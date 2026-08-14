const cron = require("node-cron");

const Investment = require("../models/Investment");
const User = require("../models/User");
const ROIHistory = require("../models/ROIHistory");

cron.schedule("* * * * *", async () => {
  console.log("Running Daily ROI Job...");

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const investments = await Investment.find({
      status: "Active",
    });

    if (investments.length === 0) {
      console.log("No Active Investments Found");
      return;
    }

    for (const investment of investments) {
      const alreadyProcessed = await ROIHistory.findOne({
        investment: investment._id,
        date: today,
      });

      if (alreadyProcessed) {
        console.log(`ROI already processed for ${investment._id}`);
        continue;
      }

      const roiAmount =
        (investment.investmentAmount *
          investment.dailyROIPercentage) /
        100;

      await ROIHistory.create({
        user: investment.user,
        investment: investment._id,
        roiAmount: roiAmount,
        roiPercentage: investment.dailyROIPercentage,
        date: today,
      });

      await Investment.findByIdAndUpdate(investment._id, {
        $inc: {
          totalROIEarned: roiAmount,
        },
      });

      await User.findByIdAndUpdate(investment.user, {
        $inc: {
          walletBalance: roiAmount,
          totalROI: roiAmount,
        },
      });

      console.log(`ROI Credited: ${roiAmount}`);
    }

    console.log("Daily ROI Distribution Completed");
  } catch (error) {
    console.error("ROI Cron Error:", error);
  }
});

console.log("ROI Cron Job Scheduled Successfully");