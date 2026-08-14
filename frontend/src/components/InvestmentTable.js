import { useEffect, useState } from "react";

function InvestmentTable() {

  const [investments, setInvestments] = useState([]);

  useEffect(() => {

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/investments/my", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Investment Data:", data);
        setInvestments(data);
      })
      .catch((err) => {
        console.log("Investment Error:", err);
      });

  }, []);


  return (
    <div>

      <h3>Investment History</h3>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Amount</th>
            <th>Plan</th>
            <th>Daily ROI %</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>


        <tbody>

          {
            investments.length > 0 ?

            investments.map((item) => (

              <tr key={item._id}>

                <td>
                  ₹ {item.amount}
                </td>

                <td>
                  {item.planDetails || "N/A"}
                </td>

                <td>
                  {item.dailyROI} %
                </td>

                <td>
                  {item.status}
                </td>

                <td>
                  {item.startDate?.slice(0,10)}
                </td>

                <td>
                  {item.endDate?.slice(0,10)}
                </td>

              </tr>

            ))

            :

            <tr>
              <td colSpan="6">
                No Investment Found
              </td>
            </tr>

          }

        </tbody>

      </table>

    </div>
  );
}

export default InvestmentTable;