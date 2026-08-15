const Investment = require("../models/Investment");
const ROIHistory = require("../models/ROIHistory");

// 🔥 GET MY ROI HISTORY
const getMyROI = async (req, res) => {
  try {

    const investments = await Investment.find({
      user: req.user.id
    });


    let totalROI = 0;


    investments.forEach((inv) => {

      totalROI += inv.totalROIEarned || 0;

    });


    const roiHistory = await ROIHistory.find({
      user: req.user.id
    }).sort({
      createdAt: -1
    });


    res.json({

      totalInvestments: investments.length,

      totalROI,

      history: roiHistory

    });


  } catch (err) {

    console.log("ROI Error:", err);

    res.status(500).json({
      message: err.message
    });

  }
};


module.exports = {
  getMyROI
};