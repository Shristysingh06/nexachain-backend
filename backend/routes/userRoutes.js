const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getDashboard,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

// =========================
// 🔹 AUTH ROUTES
// =========================

router.post("/register", registerUser);
router.post("/login", loginUser);

// =========================
// 🔹 DASHBOARD
// =========================

router.get("/dashboard", protect, getDashboard);

// =========================
// 🔹 PROFILE
// =========================

router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =========================
// 🔹 REFERRALS LIST
// =========================

router.get("/my-referrals", protect, async (req, res) => {
  try {
    const me = await User.findById(req.user._id);

    const referrals = await User.find({
      referredBy: me.referralCode,
    }).select("-password");

    res.json({
      totalReferrals: referrals.length,
      referrals,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =========================
// 🔥 REFERRAL TREE
// =========================

router.get("/referrals", protect, async (req, res) => {
  try {
    const buildTree = async (referralCode) => {
      const users = await User.find({ referredBy: referralCode });

      let result = [];

      for (let user of users) {
        const children = await buildTree(user.referralCode);

        result.push({
          name: user.name,
          referrals: children,
        });
      }

      return result;
    };

    const rootUser = await User.findById(req.user._id);

    const tree = [
      {
        name: rootUser.name,
        referrals: await buildTree(rootUser.referralCode),
      },
    ];

    res.json(tree);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =========================
// 🔹 WALLET
// =========================

router.get("/wallet", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "walletBalance totalROI totalLevelIncome"
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;