const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🔐 Protect Middleware
exports.protect = async (req, res, next) => {
  try {
    let token;

    // ✅ Check token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // ✅ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Get user
      req.user = await User.findById(decoded.id).select("-password");

      return next(); // ✅ IMPORTANT
    } else {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }
};

// 👑 Admin Middleware
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  } else {
    return res.status(403).json({
      message: "Admin only",
    });
  }
};