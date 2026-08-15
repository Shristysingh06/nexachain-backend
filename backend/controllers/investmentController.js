const Investment = require("../models/Investment");
const User = require("../models/User");
const ReferralIncome = require("../models/ReferralIncome");


// ================= CREATE INVESTMENT =================

const invest = async (req, res) => {

  try {

    const {
      investmentAmount,
      planDetails,
      dailyROIPercentage,
    } = req.body;



    // Validate Investment Amount

    if (!investmentAmount || Number(investmentAmount) <= 0) {

      return res.status(400).json({
        message: "Valid investment amount is required",
      });

    }



    const amount = Number(investmentAmount);

    const roi = Number(dailyROIPercentage) || 1;

    const plan =
      planDetails || "NexaChain Investment Plan";




    // Find User

    const user = await User.findById(req.user.id);



    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });

    }





    // Check Wallet Balance

    if (user.walletBalance < amount) {

      return res.status(400).json({
        message: "Insufficient wallet balance",
      });

    }





    // Create Investment

    const investment = new Investment({

      user: req.user.id,

      investmentAmount: amount,

      planDetails: plan,

      dailyROIPercentage: roi,

      maxDays: 30,

    });



    await investment.save();





    // Deduct Investment Amount

    user.walletBalance -= amount;


    await user.save();







    // ================= REFERRAL INCOME =================


    if (user.referredBy) {


      const referralAmount = (amount * 5) / 100;



      // Create Referral Income Record

      await ReferralIncome.create({

        user: user.referredBy,

        referredUser: user._id,

        incomeAmount: referralAmount,

        level: 1,

      });





      // Add Income To Referrer Wallet

      await User.findByIdAndUpdate(

        user.referredBy,

        {

          $inc: {

            walletBalance: referralAmount,

            totalLevelIncome: referralAmount,

          },

        }

      );


    }







    return res.status(201).json({

      message: "Investment successful",

      investment,

    });




  } catch (err) {


    console.error(
      "Investment Error:",
      err
    );


    return res.status(500).json({

      message: err.message,

    });


  }

};









// ================= GET MY INVESTMENTS =================


const getMyInvestments = async (req, res) => {

  try {


    const investments = await Investment.find({

      user: req.user.id,

    })
    .sort({
      createdAt:-1
    });



    return res.status(200).json(investments);



  } catch (err) {


    console.error(
      "Get Investments Error:",
      err
    );


    return res.status(500).json({

      message: err.message,

    });


  }

};







module.exports = {

  invest,

  getMyInvestments,

};