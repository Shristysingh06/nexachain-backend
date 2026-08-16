const Referral = require("../models/Referral");
const User = require("../models/User");

// ================= GET MY REFERRAL INCOME =================
const getMyReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find({
      user: req.user.id,
    })
      .populate("referredUser", "fullName email")
      .sort({ date: -1 });

    res.json(referrals);
  } catch (error) {
    console.error("Referral Fetch Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= CREATE REFERRAL =================
const createReferral = async (req, res) => {
  try {
    const { referredUser, level, incomeAmount } = req.body;

    if (!referredUser || !level || incomeAmount === undefined) {
      return res.status(400).json({
        message: "referredUser, level and incomeAmount are required",
      });
    }

    const receiver = await User.findById(req.user.id);

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver user not found",
      });
    }

    const generatedUser = await User.findById(referredUser);

    if (!generatedUser) {
      return res.status(404).json({
        message: "Referred user not found",
      });
    }

    const referral = await Referral.create({
      user: req.user.id,
      referredUser,
      level,
      incomeAmount,
      date: new Date(),
    });

    // Credit referral income
    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        walletBalance: incomeAmount,
        totalLevelIncome: incomeAmount,
        levelIncome: incomeAmount,
      },
    });

    res.status(201).json({
      message: "Referral income created successfully",
      referral,
    });
  } catch (error) {
    console.error("Referral Create Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMyReferrals,
  createReferral,
};