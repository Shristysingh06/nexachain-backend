import {useEffect,useState} from "react";


function ReferralTree(){

const [referrals,setReferrals]=useState([]);


useEffect(()=>{

const token=localStorage.getItem("token");


fetch("http://localhost:5000/api/referral/my",{
headers:{
Authorization:`Bearer ${token}`
}
})
.then(res=>res.json())
.then(data=>{

console.log("Referral Data:",data);

setReferrals(data);

})
.catch(err=>console.log(err));


},[]);



return(

<div>

<h3>Referral Tree</h3>


{
referrals.length>0 ?

referrals.map((user)=>(

<div key={user._id}>

👤 {user.email}

</div>

))

:

<p>No referrals found</p>

}


</div>


)

}


export default ReferralTree;