const Investment = require("../models/Investment");
const User = require("../models/User");

// =========================
// CREATE INVESTMENT
// =========================
const invest = async (req, res) => {
  try {
    const {
      investmentAmount,
      planDetails,
      dailyROIPercentage,
    } = req.body;

    // Validate amount
    if (!investmentAmount || Number(investmentAmount) <= 0) {
      return res.status(400).json({
        message: "Valid investment amount is required",
      });
    }

    const amount = Number(investmentAmount);
    const roi = Number(dailyROIPercentage) || 1;
    const plan = planDetails || "NexaChain Investment Plan";

    // Find user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check wallet balance
    if (user.walletBalance < amount) {
      return res.status(400).json({
        message: "Insufficient wallet balance",
      });
    }

    // Create investment
    const investment = new Investment({
      user: req.user.id,
      investmentAmount: amount,
      planDetails: plan,
      dailyROIPercentage: roi,
      maxDays: 30,
    });

    await investment.save();

    // Deduct investment amount from wallet
    user.walletBalance -= amount;

    await user.save();

    return res.status(201).json({
      message: "Investment successful",
      investment,
    });

  } catch (err) {
    console.error("Investment Error:", err);

    return res.status(500).json({
      message: err.message,
    });
  }
};


// =========================
// GET MY INVESTMENTS
// =========================
const getMyInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json(investments);

  } catch (err) {
    console.error("Get Investments Error:", err);

    return res.status(500).json({
      message: err.message,
    });
  }
};


module.exports = {
  invest,
  getMyInvestments,
};