const Transaction = require("../models/Transaction");
const User = require("../models/User");

// 💸 WITHDRAW REQUEST
const withdraw = async (req, res) => {
  try {
    const { amount } = req.body;

    const user = await User.findById(req.user.id);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    if (user.walletBalance < amount) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    // balance deduct
    user.walletBalance -= amount;
    await user.save();

    // create transaction
    const txn = await Transaction.create({
      user: user._id,
      amount,
      type: "withdraw",
      status: "pending",
    });

    res.json({
      message: "Withdraw request submitted",
      txn,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📜 TRANSACTION HISTORY
const getTransactions = async (req, res) => {
  try {
    const txns = await Transaction.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(txns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  withdraw,
  getTransactions,
};