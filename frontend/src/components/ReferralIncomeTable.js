import { useEffect, useState } from "react";

function ReferralIncomeTable() {

  const [income, setIncome] = useState([]);

  useEffect(() => {

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/referral/my", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    .then(res => res.json())

    .then(data => {

      console.log("Referral Income Data:", data);

      setIncome(data);

    })

    .catch(err => {
      console.log("Referral Error:", err);
    });


  }, []);



  return (

    <div>

      <h3>Referral Income History</h3>


      <table border="1" cellPadding="10">

        <thead>

          <tr>
            <th>User</th>
            <th>Level</th>
            <th>Income</th>
            <th>Date</th>
          </tr>

        </thead>


        <tbody>

        {
          income.length > 0 ?

          income.map((item)=>(

            <tr key={item._id}>

              <td>
                {item.fromUser || "User"}
              </td>

              <td>
                Level {item.level}
              </td>

              <td>
                ₹ {item.amount}
              </td>

              <td>
                {item.createdAt?.slice(0,10)}
              </td>

            </tr>

          ))

          :

          <tr>
            <td colSpan="4">
              No Referral Income Found
            </td>
          </tr>

        }

        </tbody>

      </table>


    </div>

  );

}


export default ReferralIncomeTable;