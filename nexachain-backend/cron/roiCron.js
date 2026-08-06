const cron = require("node-cron");
const Investment = require("../models/Investment");
const User = require("../models/User");

cron.schedule("0 0 * * *", async () => {
  console.log("⏰ Running Daily ROI Job...");

  try {
    const investments = await Investment.find({ status: "Active" });

    for (let inv of investments) {
      const today = new Date();

      // check investment still active
      if (today > inv.endDate) {
        inv.status = "Completed";
        await inv.save();
        continue;
      }

      // ROI calculation
      const roiAmount = (inv.amount * inv.dailyROI) / 100;

      // update user wallet
      const user = await User.findById(inv.user);

      user.walletBalance += roiAmount;
      user.totalROI += roiAmount;

      await user.save();
    }

    console.log("✅ ROI distributed successfully");

  } catch (err) {
    console.log(err);
  }
});