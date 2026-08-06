const Withdraw = require("../models/Withdraw");
const User = require("../models/User");

// Request Withdraw
exports.requestWithdraw = async (req, res) => {
  try {
    const { amount } = req.body;

    const user = await User.findById(req.user.id);

    if (user.walletBalance < amount) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    // Deduct balance
    user.walletBalance -= amount;
    await user.save();

    const withdraw = await Withdraw.create({
      user: req.user.id,
      amount,
    });

    res.status(201).json({
      message: "Withdraw request submitted",
      withdraw,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Withdraws
exports.getMyWithdraws = async (req, res) => {
  try {
    const withdraws = await Withdraw.find({ user: req.user.id });

    res.json(withdraws);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Approve Withdraw
exports.approveWithdraw = async (req, res) => {
  try {
    const withdraw = await Withdraw.findById(req.params.id);

    if (!withdraw) {
      return res.status(404).json({ message: "Not found" });
    }

    withdraw.status = "Approved";
    await withdraw.save();

    res.json({
      message: "Withdraw approved",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};