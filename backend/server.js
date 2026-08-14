const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= CRON JOB =================
require("./cron/roiCron");

// ================= ROUTES =================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const walletRoutes = require("./routes/walletRoutes");
const roiRoutes = require("./routes/roiRoutes");
const referralRoutes = require("./routes/referralRoutes");

// ================= ROUTE MOUNTING =================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/roi", roiRoutes);
app.use("/api/referral", referralRoutes);

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("API RUNNING 🚀");
});

// ================= DATABASE =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(5000, () => {
      console.log("🚀 Server running on port 5000");
    });
  })
  .catch((err) => {
    console.log("❌ DB Error:", err);
  });