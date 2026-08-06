const Investment = require("../models/Investment");
const User = require("../models/User");

// 💰 Create Investment
exports.createInvestment = async (req, res) => {
  try {
    const { amount } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.walletBalance < amount) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    // 💸 Deduct balance
    user.walletBalance -= amount;

    const investment = await Investment.create({
      user: user._id,
      amount,
    });

    await user.save();

    res.json({
      message: "Investment successful",
      investment,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// 📊 Get My Investments
exports.getMyInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({
      user: req.user._id,
    });

    res.json(investments);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};