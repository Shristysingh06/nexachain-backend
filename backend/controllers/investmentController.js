const Investment = require("../models/Investment");
const User = require("../models/User");
const ReferralIncome = require("../models/ReferralIncome");

// =====================================================
// CREATE INVESTMENT
// =====================================================

const invest = async (req, res) => {
  try {
    const {
      investmentAmount,
      planDetails,
      dailyROIPercentage,
    } = req.body;

    // -----------------------------
    // Validate investment amount
    // -----------------------------

    if (
      !investmentAmount ||
      Number(investmentAmount) <= 0
    ) {
      return res.status(400).json({
        message: "Valid investment amount is required",
      });
    }

    const amount = Number(investmentAmount);

    const roi =
      dailyROIPercentage !== undefined
        ? Number(dailyROIPercentage)
        : 1;

    const plan =
      planDetails ||
      "NexaChain Investment Plan";

    // -----------------------------
    // Validate ROI
    // -----------------------------

    if (roi <= 0) {
      return res.status(400).json({
        message: "Daily ROI must be greater than 0",
      });
    }

    // -----------------------------
    // Find user
    // -----------------------------

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // -----------------------------
    // Check wallet
    // -----------------------------

    if (user.walletBalance < amount) {
      return res.status(400).json({
        message: "Insufficient wallet balance",
      });
    }

    // =================================================
    // INVESTMENT DATES
    // =================================================

    const startDate = new Date();

    const maxDays = 30;

    const endDate = new Date(startDate);
    endDate.setDate(
      endDate.getDate() + maxDays
    );

    // =================================================
    // CREATE INVESTMENT
    // =================================================

    const investment = new Investment({
      user: user._id,

      investmentAmount: amount,

      planDetails: plan,

      dailyROIPercentage: roi,

      startDate,

      endDate,

      maxDays,

      status: "Active",
    });

    await investment.save();

    // =================================================
    // DEDUCT INVESTMENT AMOUNT FROM WALLET
    // =================================================

    user.walletBalance -= amount;

    await user.save();

    // =================================================
    // LEVEL 1 REFERRAL INCOME
    // 5%
    // =================================================

    if (user.referredBy) {
      const level1User = await User.findById(
        user.referredBy
      );

      if (level1User) {
        const level1Amount =
          (amount * 5) / 100;

        const existingLevel1 =
          await ReferralIncome.findOne({
            referredUser: user._id,
            user: level1User._id,
            level: 1,
            investment: investment._id,
          });

        if (!existingLevel1) {
          await ReferralIncome.create({
            user: level1User._id,

            referredUser: user._id,

            investment: investment._id,

            level: 1,

            incomeAmount: level1Amount,

            date: new Date(),
          });

          await User.findByIdAndUpdate(
            level1User._id,
            {
              $inc: {
                walletBalance: level1Amount,

                totalLevelIncome:
                  level1Amount,
              },
            }
          );

          console.log(
            `Level 1 Income Credited: ₹${level1Amount}`
          );
        }

        // =================================================
        // LEVEL 2 REFERRAL INCOME
        // 2%
        // =================================================

        if (level1User.referredBy) {
          const level2User =
            await User.findById(
              level1User.referredBy
            );

          if (level2User) {
            const level2Amount =
              (amount * 2) / 100;

            const existingLevel2 =
              await ReferralIncome.findOne({
                referredUser: user._id,

                user: level2User._id,

                level: 2,

                investment: investment._id,
              });

            if (!existingLevel2) {
              await ReferralIncome.create({
                user: level2User._id,

                referredUser: user._id,

                investment: investment._id,

                level: 2,

                incomeAmount: level2Amount,

                date: new Date(),
              });

              await User.findByIdAndUpdate(
                level2User._id,
                {
                  $inc: {
                    walletBalance:
                      level2Amount,

                    totalLevelIncome:
                      level2Amount,
                  },
                }
              );

              console.log(
                `Level 2 Income Credited: ₹${level2Amount}`
              );
            }
          }
        }
      }
    }

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({
      message: "Investment successful",

      investment,

      walletBalance:
        user.walletBalance,
    });
  } catch (err) {
    console.error(
      "Investment Error:",
      err
    );

    return res.status(500).json({
      message: err.message,
    });
  }
};

// =====================================================
// GET MY INVESTMENTS
// =====================================================

const getMyInvestments = async (req, res) => {
  try {
    const investments =
      await Investment.find({
        user: req.user.id,
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json(
      investments
    );
  } catch (err) {
    console.error(
      "Get Investments Error:",
      err
    );

    return res.status(500).json({
      message: err.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  invest,
  getMyInvestments,
};