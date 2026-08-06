const Investment = require("../models/Investment");
const User = require("../models/User");

// Create Investment
exports.createInvestment = async (req, res) => {
  try {
    const {
      investmentAmount,
      planDetails,
      dailyROIPercentage,
      durationDays,
    } = req.body;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    const totalExpectedReturn =
      investmentAmount +
      (investmentAmount * dailyROIPercentage / 100) * durationDays;

    const investment = await Investment.create({
      user: req.user.id,
      investmentAmount,
      planDetails,
      dailyROIPercentage,
      endDate,
      totalExpectedReturn,
    });

    res.status(201).json({
      message: "Investment created successfully",
      investment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Investments
exports.getMyInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user.id });

    res.status(200).json(investments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};