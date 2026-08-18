const ReferralIncome = require("../models/ReferralIncome");
const User = require("../models/User");

// =====================================================
// GET MY REFERRAL INCOME HISTORY
// =====================================================

const getMyReferrals = async (req, res) => {
  try {
    const referrals = await ReferralIncome.find({
      user: req.user.id,
    })
      .populate("referredUser", "fullName email referralCode")
      .populate(
        "investment",
        "investmentAmount planDetails dailyROIPercentage"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json(referrals);
  } catch (error) {
    console.error(
      "Referral Income Fetch Error:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// CREATE REFERRAL INCOME
// =====================================================

const createReferral = async (req, res) => {
  try {
    const {
      referredUser,
      level,
      incomeAmount,
      investment,
    } = req.body;

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (
      !referredUser ||
      !level ||
      incomeAmount === undefined ||
      !investment
    ) {
      return res.status(400).json({
        message:
          "referredUser, level, incomeAmount and investment are required",
      });
    }

    // -----------------------------------------------
    // FIND RECEIVER
    // -----------------------------------------------

    const receiver = await User.findById(
      req.user.id
    );

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver user not found",
      });
    }

    // -----------------------------------------------
    // FIND GENERATED USER
    // -----------------------------------------------

    const generatedUser = await User.findById(
      referredUser
    );

    if (!generatedUser) {
      return res.status(404).json({
        message: "Referred user not found",
      });
    }

    // -----------------------------------------------
    // CHECK DUPLICATE
    // -----------------------------------------------

    const existingReferral =
      await ReferralIncome.findOne({
        user: req.user.id,
        referredUser,
        investment,
        level,
      });

    if (existingReferral) {
      return res.status(400).json({
        message:
          "Referral income already exists for this investment",
        referral: existingReferral,
      });
    }

    // -----------------------------------------------
    // CREATE REFERRAL INCOME
    // -----------------------------------------------

    const referral =
      await ReferralIncome.create({
        user: req.user.id,

        referredUser,

        investment,

        level,

        incomeAmount,

        date: new Date(),
      });

    // -----------------------------------------------
    // CREDIT USER WALLET
    // -----------------------------------------------

    await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: {
          walletBalance: incomeAmount,

          totalLevelIncome:
            incomeAmount,
        },
      }
    );

    return res.status(201).json({
      message:
        "Referral income created successfully",

      referral,
    });
  } catch (error) {
    console.error(
      "Referral Create Error:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// GET COMPLETE REFERRAL TREE
// =====================================================

const getReferralTree = async (req, res) => {
  try {
    const buildTree = async (userId) => {
      const children = await User.find(
        {
          referredBy: userId,
        },
        "fullName email referralCode referredBy"
      ).lean();

      const tree = [];

      for (const child of children) {
        tree.push({
          _id: child._id,

          fullName: child.fullName,

          email: child.email,

          referralCode:
            child.referralCode,

          referredBy:
            child.referredBy,

          children:
            await buildTree(child._id),
        });
      }

      return tree;
    };

    const tree = await buildTree(
      req.user.id
    );

    return res.status(200).json({
      userId: req.user.id,

      tree,
    });
  } catch (error) {
    console.error(
      "Referral Tree Error:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getMyReferrals,
  createReferral,
  getReferralTree,
};