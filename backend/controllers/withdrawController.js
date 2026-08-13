const Withdraw = require("../models/Withdraw");

// 🔥 REQUEST WITHDRAW
const requestWithdraw = async (req, res) => {
  try {
    const { amount } = req.body;

    const withdraw = new Withdraw({
      user: req.user.id,
      amount
    });

    await withdraw.save();

    res.json({ message: "Withdraw request sent", withdraw });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔥 GET MY WITHDRAWS
const getMyWithdrawals = async (req, res) => {
  try {
    const data = await Withdraw.find({ user: req.user.id });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  requestWithdraw,
  getMyWithdrawals
};