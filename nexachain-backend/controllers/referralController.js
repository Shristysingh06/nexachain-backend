const User = require("../models/User");
const ReferralIncome = require("../models/ReferralIncome");

// 🔥 LEVEL INCOME DISTRIBUTION (already done)
exports.distributeLevelIncome = async (userId, amount) => {
  try {
    let currentUser = await User.findById(userId);

    let level = 1;
    let maxLevels = 3;

    while (currentUser.referredBy && level <= maxLevels) {
      const parent = await User.findOne({
        referralCode: currentUser.referredBy,
      });

      if (!parent) break;

      let percentage = level === 1 ? 10 : level === 2 ? 5 : 2;

      const income = (amount * percentage) / 100;

      parent.totalLevelIncome += income;
      await parent.save();

      await ReferralIncome.create({
        user: parent._id,
        referredUser: currentUser._id,
        incomeAmount: income,
        level,
      });

      currentUser = parent;
      level++;
    }
  } catch (error) {
    console.log(error);
  }
};

// ✅ CREATE REFERRAL INCOME (dummy / manual test)
exports.createReferralIncome = async (req, res) => {
  try {
    const { user, referredUser, amount, level } = req.body;

    const data = await ReferralIncome.create({
      user,
      referredUser,
      incomeAmount: amount,
      level,
    });

    res.json({ message: "Referral Income Created", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET ALL REFERRAL INCOME
exports.getReferralIncome = async (req, res) => {
  try {
    const data = await ReferralIncome.find()
      .populate("user", "fullName email")
      .populate("referredUser", "fullName email");

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};