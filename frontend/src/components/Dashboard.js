import React, { useEffect, useState } from "react";

function Dashboard() {
  const [data, setData] = useState({
    totalInvestment: 0,
    wallet: 0,
    dailyROI: 0
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/users/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const result = await res.json();
      console.log("DASHBOARD DATA:", result);

      setData(result);

    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>

      <p>Total Investment: {data.totalInvestment}</p>
      <p>Wallet Balance: {data.wallet}</p>
      <p>Daily ROI: {data.dailyROI}</p>
    </div>
  );
}

export default Dashboard;