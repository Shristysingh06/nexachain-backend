const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      password,
      referralCode,
    } = req.body;

    // Required fields
    if (!fullName || !email || !mobile || !password) {
      return res.status(400).json({
        message: "Full name, email, mobile and password are required",
      });
    }

    // Check existing email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // ================= REFERRAL =================
    let referredBy = null;

    if (referralCode && referralCode.trim() !== "") {
      const referringUser = await User.findOne({
        referralCode: referralCode.trim(),
      });

      if (!referringUser) {
        return res.status(400).json({
          message: "Invalid referral code",
        });
      }

      referredBy = referringUser._id;
    }

    // ================= CREATE USER =================
    const user = new User({
      fullName,
      email,
      mobile,
      password,
      referredBy,
    });

    await user.save();

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};
