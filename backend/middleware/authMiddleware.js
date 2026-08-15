const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  console.log("AUTH HEADER:", authHeader ? "RECEIVED" : "MISSING");

  if (!authHeader) {
    return res.status(401).json({
      message: "No token, authorization denied",
    });
  }

  const parts = authHeader.split(" ");

  console.log("AUTH PARTS:", parts.length);
  console.log("BEARER TYPE:", parts[0]);

  const token = parts[1];

  if (!token) {
    return res.status(401).json({
      message: "Token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("JWT VERIFIED:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message);

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};