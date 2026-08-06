const Withdraw = require("../models/Withdraw");
const User = require("../models/User");

// 💸 Request Withdraw
exports.requestWithdraw = async (req, res) => {
  try {
    const { amount, accountDetails } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (amount > user.walletBalance) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const withdraw = await Withdraw.create({
      user: user._id,
      amount,
      accountDetails,
    });

    res.json({ message: "Withdraw request submitted", withdraw });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👑 Admin Approve
exports.approveWithdraw = async (req, res) => {
  try {
    const withdraw = await Withdraw.findById(req.params.id);

    if (!withdraw) {
      return res.status(404).json({ message: "Withdraw not found" });
    }

    if (withdraw.status !== "Pending") {
      return res.status(400).json({ message: "Already processed" });
    }

    const user = await User.findById(withdraw.user);

    if (withdraw.amount > user.walletBalance) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 💰 deduct
    user.walletBalance -= withdraw.amount;
    await user.save();

    withdraw.status = "Approved";
    await withdraw.save();

    res.json({ message: "Withdraw approved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Reject
exports.rejectWithdraw = async (req, res) => {
  try {
    const withdraw = await Withdraw.findById(req.params.id);

    if (!withdraw) {
      return res.status(404).json({ message: "Withdraw not found" });
    }

    withdraw.status = "Rejected";
    await withdraw.save();

    res.json({ message: "Withdraw rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📄 My Withdraws
exports.myWithdraws = async (req, res) => {
  try {
    const data = await Withdraw.find({ user: req.user.id });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};