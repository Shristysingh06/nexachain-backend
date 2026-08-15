import { useEffect, useState } from "react";

import InvestmentTable from "../components/InvestmentTable";
import ROIHistory from "../components/ROIHistory";
import ReferralIncomeTable from "../components/ReferralIncomeTable";
import ReferralTree from "../components/ReferralTree";
import Charts from "../components/Charts";


function Dashboard() {


  const [data, setData] = useState({
    walletBalance: 0,
    totalROI: 0,
    totalLevelIncome: 0,
    totalInvestment: 0,
  });


  const [loading, setLoading] = useState(true);



  // LOGOUT
  const logout = () => {

    localStorage.removeItem("token");

    window.location.href = "/";

  };




  // FETCH DASHBOARD DATA
  const fetchDashboard = async () => {

    try {


      const token = localStorage.getItem("token");


      if(!token){

        alert("Please login first");

        window.location.href="/";

        return;

      }



      const res = await fetch(
        "http://localhost:5000/api/users/dashboard",
        {
          method:"GET",

          headers:{

            Authorization:`Bearer ${token}`,

            "Content-Type":"application/json"

          }

        }
      );



      const result = await res.json();



      console.log("Dashboard Data:", result);

      console.log("Wallet:", result.walletBalance);

      console.log("Investment:", result.totalInvestment);

      console.log("ROI:", result.totalROI);




      if(res.ok){


        setData({

          walletBalance: result.walletBalance || 0,

          totalROI: result.totalROI || 0,

          totalLevelIncome: result.totalLevelIncome || 0,

          totalInvestment: result.totalInvestment || 0,

        });


      }

      else{


        alert(result.message);


      }



    }

    catch(error){


      console.log("Dashboard Error:",error);


    }

    finally{


      setLoading(false);


    }


  };





  useEffect(()=>{


    fetchDashboard();


  },[]);






  if(loading){


    return <h2>Loading Dashboard...</h2>;


  }







  return(


    <div>


      <h1>NexaChain Dashboard</h1>



      <button onClick={logout}>
        Logout
      </button>





      <div className="cards">



        <div className="card">

          <h3>Total Investment</h3>

          <p>
            ₹ {data.totalInvestment}
          </p>

        </div>





        <div className="card">

          <h3>Wallet Balance</h3>

          <p>
            ₹ {data.walletBalance}
          </p>

        </div>





        <div className="card">

          <h3>Total ROI</h3>

          <p>
            ₹ {data.totalROI}
          </p>

        </div>





        <div className="card">

          <h3>Level Income</h3>

          <p>
            ₹ {data.totalLevelIncome}
          </p>

        </div>




      </div>




      <hr />



      <InvestmentTable />



      <ROIHistory />



      <ReferralIncomeTable />



      <ReferralTree />



      <Charts />



    </div>


  );


}



export default Dashboard;