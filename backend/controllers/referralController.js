const Referral = require("../models/Referral");

// 🔥 GET MY REFERRALS
const getMyReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find({ user: req.user.id });
    res.json(referrals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔥 CREATE REFERRAL
const createReferral = async (req, res) => {
  try {
    const { referredUser } = req.body;

    const referral = new Referral({
      user: req.user.id,
      referredUser
    });

    await referral.save();

    res.json({ message: "Referral created", referral });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getMyReferrals,
  createReferral
};