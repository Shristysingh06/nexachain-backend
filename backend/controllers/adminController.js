const User = require("../models/User");
const Investment = require("../models/Investment");
const Withdraw = require("../models/Withdraw");

// ================= 👥 USERS =================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= 💰 INVESTMENTS =================
exports.getAllInvestments = async (req, res) => {
  try {
    const investments = await Investment.find().populate(
      "user",
      "email fullName"
    );
    res.json(investments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= 💸 WITHDRAWS =================
exports.getAllWithdraws = async (req, res) => {
  try {
    const withdraws = await Withdraw.find().populate(
      "user",
      "email fullName walletBalance"
    );
    res.json(withdraws);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= ✅ APPROVE =================
exports.approveWithdraw = async (req, res) => {
  try {
    const withdraw = await Withdraw.findById(req.params.id).populate("user");

    if (!withdraw) {
      return res.status(404).json({ message: "Withdraw not found" });
    }

    if (withdraw.status !== "pending") {
      return res.status(400).json({ message: "Already processed" });
    }

    withdraw.status = "approved";
    await withdraw.save();

    res.json({ message: "Withdraw approved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= ❌ REJECT + REFUND =================
exports.rejectWithdraw = async (req, res) => {
  try {
    const withdraw = await Withdraw.findById(req.params.id).populate("user");

    if (!withdraw) {
      return res.status(404).json({ message: "Withdraw not found" });
    }

    if (withdraw.status !== "pending") {
      return res.status(400).json({ message: "Already processed" });
    }

    // 🔁 Refund amount
    withdraw.user.walletBalance += withdraw.amount;
    await withdraw.user.save();

    withdraw.status = "rejected";
    await withdraw.save();

    res.json({
      message: "Withdraw rejected & amount refunded",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};