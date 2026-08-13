const Wallet = require("../models/Wallet");

const getWallet = async (req, res) => {
  try {
    // 🔐 user id middleware से आ रही है
    const wallet = await Wallet.findOne({ user: req.user.id });

    // 👉 अगर wallet exist नहीं करता
    if (!wallet) {
      return res.status(200).json({
        balance: 0
      });
    }

    // 👉 अगर wallet मिल गया
    res.status(200).json({
      balance: wallet.balance
    });

  } catch (err) {
    console.error("Wallet Error:", err);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

module.exports = {
  getWallet
};