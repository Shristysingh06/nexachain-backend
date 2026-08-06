const cron = require("node-cron");

const Investment = require("../models/Investment");
const User = require("../models/User");
const ROIHistory = require("../models/ROIHistory");


// ===============================
// DAILY ROI CRON JOB
// Runs Every Day at 12:00 AM
// ===============================

cron.schedule("0 0 * * *", async () => {

  console.log("⏰ Running Daily ROI Job...");

  try {

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    // Find active investments

    const investments = await Investment.find({
      status: "Active"
    });


    if (investments.length === 0) {

      console.log("No Active Investments Found");

      return;

    }



    for (const investment of investments) {


      // Check duplicate ROI

      const alreadyProcessed = await ROIHistory.findOne({

        investment: investment._id,

        date: today

      });



      if (alreadyProcessed) {

        console.log(
          `⏭ ROI already processed for ${investment._id}`
        );

        continue;

      }



      // Calculate ROI

      const roiAmount =
        (investment.amount * investment.dailyROI) / 100;



      // Save ROI History

      await ROIHistory.create({

        user: investment.user,

        investment: investment._id,

        amount: roiAmount,

        date: today,

        status: "Credited"

      });



      // Update User Wallet

      await User.findByIdAndUpdate(

        investment.user,

        {

          $inc: {

            walletBalance: roiAmount,

            totalROI: roiAmount

          }

        }

      );



      console.log(
        `✅ ROI Credited: ${roiAmount}`
      );

    }



    console.log(
      "🎉 Daily ROI Distribution Completed"
    );



  } catch (error) {


    console.log(
      "❌ ROI Cron Error:",
      error.message
    );


  }


});



console.log("✅ ROI Cron Scheduler Started");
