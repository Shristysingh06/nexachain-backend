const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  referredUser: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Referral", referralSchema);