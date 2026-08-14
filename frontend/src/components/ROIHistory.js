import { useEffect, useState } from "react";

function ROIHistory() {

  const [roiData, setRoiData] = useState([]);

  useEffect(() => {

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/roi/my", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    .then(res => res.json())

    .then(data => {
      console.log("ROI Data:", data);
      setRoiData(data);
    })

    .catch(err => {
      console.log("ROI Error:", err);
    });


  }, []);



  return (

    <div>

      <h3>ROI History</h3>

      <table border="1" cellPadding="10">

        <thead>

          <tr>
            <th>ROI Amount</th>
            <th>Date</th>
            <th>Status</th>
          </tr>

        </thead>


        <tbody>

        {
          roiData.length > 0 ?

          roiData.map((item)=>(

            <tr key={item._id}>

              <td>
                ₹ {item.roiAmount}
              </td>

              <td>
                {item.date?.slice(0,10)}
              </td>

              <td>
                {item.status}
              </td>

            </tr>

          ))

          :

          <tr>
            <td colSpan="3">
              No ROI History Found
            </td>
          </tr>

        }

        </tbody>

      </table>


    </div>

  );

}

export default ROIHistory;