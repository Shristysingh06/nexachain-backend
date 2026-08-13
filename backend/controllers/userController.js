const User = require("../models/User");
const Investment = require("../models/Investment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    const { fullName, mobile, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      fullName,
      mobile,
      email,
      password: hashedPassword,
      walletBalance: 0,
      totalROI: 0,
      totalLevelIncome: 0,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DASHBOARD (FIXED 🔥) =================
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // user data
    const user = await User.findById(userId);

    // investments
    const investments = await Investment.find({ user: userId });

    // total investment
    const totalInvestment = investments.reduce(
      (sum, inv) => sum + inv.amount,
      0
    );

    res.json({
      walletBalance: user.walletBalance || 0,
      totalROI: user.totalROI || 0,
      totalLevelIncome: user.totalLevelIncome || 0,
      totalInvestment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};