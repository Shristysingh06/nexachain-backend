const cron = require("node-cron");

const Investment = require("../models/Investment");
const User = require("../models/User");
const ROIHistory = require("../models/ROIHistory");

cron.schedule("0 0 * * *", async () => {
  console.log("⏰ Running Daily ROI Job...");

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const investments = await Investment.find({
      status: "Active"
    });

    if (investments.length === 0) {
      console.log("No Active Investments Found");
      return;
    }

    for (const investment of investments) {
      const alreadyProcessed = await ROIHistory.findOne({
        investment: investment._id,
        date: today
      });

      if (alreadyProcessed) {
        console.log(`⏭ ROI already processed for ${investment._id}`);
        continue;
      }

      const roiAmount =
        (investment.amount * investment.dailyROI) / 100;

      await ROIHistory.create({
        user: investment.user,
        investment: investment._id,
        amount: roiAmount,
        date: today,
        status: "Credited"
      });

      await User.findByIdAndUpdate(investment.user, {
        $inc: {
          walletBalance: roiAmount,
          totalROI: roiAmount
        }
      });

      console.log(`✅ ROI Credited: ${roiAmount}`);
    }

    console.log("🎉 Daily ROI Distribution Completed");
  } catch (error) {
    console.log("❌ ROI Cron Error:", error.message);
  }
});

console.log("✅ ROI Cron Scheduler Started");