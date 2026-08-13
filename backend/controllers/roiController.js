const Investment = require("../models/Investment");

// 🔥 GET ROI
const getMyROI = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user.id });

    let totalROI = 0;

    investments.forEach(inv => {
      totalROI += inv.amount * 0.1; // example 10% ROI
    });

    res.json({
      totalInvestments: investments.length,
      totalROI
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getMyROI
};