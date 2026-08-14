import { useEffect, useState } from "react";

import ReferralTree from "../components/ReferralTree";
import InvestmentTable from "../components/InvestmentTable";
import ROIHistory from "../components/ROIHistory";
import ReferralIncomeTable from "../components/ReferralIncomeTable";
import Charts from "../components/Charts";

function Dashboard() {
  const [data, setData] = useState({
    walletBalance: 0,
    totalROI: 0,
    totalLevelIncome: 0,
    totalInvestment: 0,
  });

  const [loading, setLoading] = useState(true);

  // LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // FETCH DASHBOARD
  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first ❌");
        setLoading(false);
        return;
      }

      const res = await fetch(
        "http://localhost:5000/api/users/dashboard",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Error loading dashboard ❌");
        setLoading(false);
        return;
      }

      console.log("DASHBOARD DATA:", result);

      setData(result);
      setLoading(false);
    } catch (err) {
      console.log("Dashboard Error:", err);
      setLoading(false);
    }
  };

  // INVEST FUNCTION
  const investMoney = async () => {
    console.log("BUTTON CLICKED ✅");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first ❌");
        return;
      }

      const res = await fetch(
        "http://localhost:5000/api/investments",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            investmentAmount: 1000,
            planDetails: "Basic Investment Plan",
            dailyROIPercentage: 1,
          }),
        }
      );

      const result = await res.json();

      console.log("INVEST RESPONSE:", result);

      if (!res.ok) {
        alert(result.message || "Investment failed ❌");
        return;
      }

      alert("Investment Successful ✅");

      // Refresh dashboard after investment
      await fetchDashboard();
    } catch (err) {
      console.log("INVEST ERROR:", err);
      alert("Server error ❌");
    }
  };

  // LOAD DATA
  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Dashboard</h1>

        <button
          onClick={logout}
          style={{
            background: "red",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* INVEST BUTTON */}
      <button
        onClick={investMoney}
        style={{
          padding: "10px 20px",
          background: "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
          marginTop: "20px",
          cursor: "pointer",
        }}
      >
        Invest ₹1000
      </button>

      {/* CARDS */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Investment</h3>
          <p>₹ {data.totalInvestment || 0}</p>
        </div>

        <div style={cardStyle}>
          <h3>Daily ROI</h3>
          <p>₹ {data.totalROI || 0}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Level Income</h3>
          <p>₹ {data.totalLevelIncome || 0}</p>
        </div>

        <div style={cardStyle}>
          <h3>Wallet Balance</h3>
          <p>₹ {data.walletBalance || 0}</p>
        </div>
      </div>

      {/* REFERRAL TREE */}
      <div style={{ marginTop: "40px" }}>
        <ReferralTree />
      </div>

      {/* INVESTMENT HISTORY */}
      <div style={{ marginTop: "40px" }}>
        <InvestmentTable />
      </div>

      {/* ROI HISTORY */}
      <div style={{ marginTop: "40px" }}>
        <ROIHistory />
      </div>

      {/* REFERRAL INCOME */}
      <div style={{ marginTop: "40px" }}>
        <ReferralIncomeTable />
      </div>

      {/* CHARTS */}
      <div style={{ marginTop: "40px" }}>
        <Charts />
      </div>
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ccc",
  borderRadius: "10px",
  padding: "20px",
  width: "200px",
  textAlign: "center",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

export default Dashboard;