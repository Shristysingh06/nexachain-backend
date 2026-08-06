const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load env
dotenv.config();

const app = express();

// ======================
// 🔹 MIDDLEWARE
// ======================
app.use(express.json());
app.use(cors());

// ======================
// 🔹 ROUTES
// ======================
app.get("/", (req, res) => {
  res.send("🚀 Nexachain API running...");
});

// User Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// ROI Routes
const roiRoutes = require("./routes/roiRoutes");
app.use("/api/roi", roiRoutes);

// ======================
// 🔥 CRON JOB
// ======================
require("./cron/roiCron");

// ======================
// 🔹 DATABASE CONNECT
// ======================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

// ======================
// 🔹 SERVER START
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});