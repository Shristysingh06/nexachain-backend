const Wallet = require("../models/Wallet");

const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      return res.status(200).json({
        balance: 0,
        wallet: null,
      });
    }

    return res.status(200).json({
      balance: wallet.balance || 0,
      wallet,
    });
  } catch (error) {
    console.error("Wallet Error:", error);

    return res.status(500).json({
      message: "Failed to fetch wallet",
      error: error.message,
    });
  }
};

module.exports = {
  getWallet,
};