import { useEffect, useState } from "react";

function Dashboard() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/users/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      <h2>Dashboard</h2>

      <h3>Total Investment: ₹ {data.totalInvestment}</h3>
      <h3>Wallet: ₹ {data.walletBalance}</h3>
      <h3>ROI: ₹ {data.totalROI}</h3>
      <h3>Level Income: ₹ {data.totalLevelIncome}</h3>
    </div>
  );
}

export default Dashboard;