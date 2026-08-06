const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const ROIHistory = require("../models/ROIHistory");


router.get("/my", protect, async (req, res) => {

  try {

    const roiHistory = await ROIHistory.find({
      user: req.user._id
    })
    .populate("investment")
    .sort({ date: -1 });


    res.json(roiHistory);


  } catch(error){

    res.status(500).json({
      message: error.message
    });

  }

});


module.exports = router;