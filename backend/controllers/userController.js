const User = require("../models/User");
const Investment = require("../models/Investment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    const {
      fullName,
      mobile,
      email,
      password,
      referralCode,
    } = req.body;

    if (!fullName || !mobile || !email || !password) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Find referring user if referral code is provided
    let referredBy = null;

    if (referralCode) {
      const referringUser = await User.findOne({
        referralCode: referralCode.trim().toUpperCase(),
      });

      if (!referringUser) {
        return res.status(400).json({
          message: "Invalid referral code",
        });
      }

      referredBy = referringUser._id;
    }

    // IMPORTANT:
    // Do NOT manually bcrypt hash here.
    // User model's pre-save middleware handles hashing.
    const user = new User({
      fullName,
      mobile,
      email,
      password,
      referredBy,
      walletBalance: 0,
      totalROI: 0,
      totalLevelIncome: 0,
      levelIncome: 0,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      referralCode: user.referralCode,
    });
  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= DASHBOARD =================
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const investments = await Investment.find({
      user: userId,
    });

    // IMPORTANT: Investment model uses investmentAmount
    const totalInvestment = investments.reduce(
      (sum, inv) => sum + (inv.investmentAmount || 0),
      0
    );

    res.json({
      walletBalance: user.walletBalance || 0,
      totalROI: user.totalROI || 0,
      totalLevelIncome: user.totalLevelIncome || 0,
      totalInvestment,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};