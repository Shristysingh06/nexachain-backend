const User = require("../models/User");
const jwt = require("jsonwebtoken");

// =========================
// 🔐 GENERATE TOKEN
// =========================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// =========================
// 🔹 REGISTER USER
// =========================
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, mobile, password, referralCode } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = new User({
      fullName,
      email,
      mobile,
      password,
      referredBy: referralCode || null,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      role: user.role,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// 🔹 LOGIN USER
// =========================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      role: user.role,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// 🔹 DASHBOARD API ✅
// =========================
exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "walletBalance totalROI totalLevelIncome"
    );

    res.json({
      walletBalance: user.walletBalance,
      totalROI: user.totalROI,
      totalLevelIncome: user.totalLevelIncome,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};