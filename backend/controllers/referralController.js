const User = require("../models/User");
const ReferralIncome = require("../models/ReferralIncome");



// GET MY REFERRALS

exports.getMyReferrals = async(req,res)=>{

try{


const referrals = await User.find({

referredBy:req.user.id

})
.select(
"fullName email referralCode createdAt"
);



res.json(referrals);



}catch(error){

res.status(500).json({

message:error.message

});


}

};





// CREATE REFERRAL INCOME


exports.createReferral = async(req,res)=>{


try{


const {

referredUser,

incomeAmount,

level

}=req.body;



const referral = await ReferralIncome.create({

user:req.user.id,

referredUser,

incomeAmount:incomeAmount || 0,

level:level || 1

});



res.status(201).json({

message:"Referral income created",

referral

});



}catch(error){


res.status(500).json({

message:error.message

});


}


};