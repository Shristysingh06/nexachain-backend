const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());

// 🔗 Routes Import
const userRoutes = require("./routes/userRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const referralRoutes = require("./routes/referralRoutes");
const withdrawRoutes = require("./routes/withdrawRoutes");

// 📌 API Routes
app.use("/api/users", userRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/withdraw", withdrawRoutes);

// 🧪 Test Route
app.get("/", (req, res) => {
  res.send("🚀 Nexachain API Running...");
});

// 🌐 Port
const PORT = process.env.PORT || 5000;

console.log("MONGO URI loaded:", process.env.MONGO_URI ? "YES" : "NO");
console.log("⏳ Starting MongoDB connection...");

// 🗄️ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err.message);
  });