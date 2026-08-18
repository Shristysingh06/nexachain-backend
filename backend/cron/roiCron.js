const cron = require("node-cron");

const Investment = require("../models/Investment");
const User = require("../models/User");
const ROIHistory = require("../models/ROIHistory");

// =====================================================
// ROI PROCESSING FUNCTION
// =====================================================

const runROIJob = async () => {
  console.log("=================================");
  console.log("Running Daily ROI Job...");
  console.log("=================================");

  try {
    const now = new Date();

    // Current day start
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    // Current day end
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // =================================================
    // FIND ACTIVE INVESTMENTS
    // =================================================

    const investments = await Investment.find({
      status: "Active",
    });

    if (investments.length === 0) {
      console.log("No Active Investments Found");

      return {
        processed: 0,
        message: "No Active Investments Found",
      };
    }

    console.log(
      `Active Investments Found: ${investments.length}`
    );

    let processed = 0;
    let skipped = 0;
    let completed = 0;

    // =================================================
    // PROCESS EACH INVESTMENT
    // =================================================

    for (const investment of investments) {
      try {
        // =================================================
        // CHECK END DATE
        // =================================================

        if (
          investment.endDate &&
          now >= new Date(investment.endDate)
        ) {
          await Investment.findByIdAndUpdate(
            investment._id,
            {
              $set: {
                status: "Completed",
              },
            }
          );

          console.log(
            `Investment Completed: ${investment._id}`
          );

          completed++;

          continue;
        }

        // =================================================
        // CHECK START DATE
        // =================================================

        if (
          investment.startDate &&
          now < new Date(investment.startDate)
        ) {
          console.log(
            `Investment not started yet: ${investment._id}`
          );

          skipped++;

          continue;
        }

        // =================================================
        // CHECK DUPLICATE ROI
        // =================================================

        const alreadyProcessed =
          await ROIHistory.findOne({
            investment: investment._id,
            date: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
            status: "Credited",
          });

        if (alreadyProcessed) {
          console.log(
            `ROI already processed for ${investment._id}`
          );

          skipped++;

          continue;
        }

        // =================================================
        // CALCULATE ROI
        // =================================================

        const roiAmount =
          (investment.investmentAmount *
            investment.dailyROIPercentage) /
          100;

        // =================================================
        // CREATE ROI HISTORY
        // =================================================

        await ROIHistory.create({
          user: investment.user,
          investment: investment._id,
          roiAmount,
          roiPercentage:
            investment.dailyROIPercentage,
          date: new Date(),
          status: "Credited",
        });

        // =================================================
        // UPDATE INVESTMENT
        // =================================================

        await Investment.findByIdAndUpdate(
          investment._id,
          {
            $inc: {
              totalROIEarned: roiAmount,
            },
          }
        );

        // =================================================
        // UPDATE USER WALLET
        // =================================================

        await User.findByIdAndUpdate(
          investment.user,
          {
            $inc: {
              walletBalance: roiAmount,
              totalROI: roiAmount,
            },
          }
        );

        processed++;

        console.log(
          `ROI Credited: ₹${roiAmount} | Investment: ${investment._id}`
        );
      } catch (investmentError) {
        console.error(
          `Investment Error ${investment._id}:`,
          investmentError.message
        );
      }
    }

    console.log("=================================");
    console.log("Daily ROI Distribution Completed");
    console.log(
      `Processed: ${processed} | Skipped: ${skipped} | Completed: ${completed}`
    );
    console.log("=================================");

    return {
      processed,
      skipped,
      completed,
    };
  } catch (error) {
    console.error(
      "ROI Cron Error:",
      error
    );

    throw error;
  }
};

// =====================================================
// AUTOMATIC CRON
// Every day at 12:00 AM IST
// =====================================================

cron.schedule(
  "0 0 * * *",
  async () => {
    await runROIJob();
  },
  {
    timezone: "Asia/Kolkata",
  }
);

console.log(
  "ROI Cron Job Scheduled Successfully"
);

// =====================================================
// EXPORT FOR TESTING
// =====================================================

module.exports = {
  runROIJob,
};