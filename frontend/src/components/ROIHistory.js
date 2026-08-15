import { useEffect, useState } from "react";


function ROIHistory() {

  const [roiData, setRoiData] = useState({
    totalInvestments: 0,
    totalROI: 0,
    history: []
  });


  useEffect(() => {

    const token = localStorage.getItem("token");


    fetch("http://localhost:5000/api/roi/my", {

      headers:{
        Authorization:`Bearer ${token}`
      }

    })

    .then(res=>res.json())

    .then(data=>{

      console.log("ROI Data:",data);

      setRoiData(data);

    })

    .catch(err=>{

      console.log("ROI Error:",err);

    });


  },[]);



  return (

    <div>

      <h3>ROI History</h3>


      <table border="1" cellPadding="10">

        <thead>

          <tr>
            <th>Total Investments</th>
            <th>Total ROI</th>
          </tr>

        </thead>


        <tbody>

          <tr>

            <td>
              {roiData.totalInvestments}
            </td>


            <td>
              ₹ {roiData.totalROI}
            </td>


          </tr>

        </tbody>


      </table>



      <br/>


      <h4>ROI Transactions</h4>


      <table border="1" cellPadding="10">

        <thead>

          <tr>
            <th>Amount</th>
            <th>ROI %</th>
            <th>Date</th>
          </tr>

        </thead>


        <tbody>


        {
          roiData.history.length > 0 ?

          roiData.history.map((item)=>(

            <tr key={item._id}>

              <td>
                ₹ {item.roiAmount}
              </td>


              <td>
                {item.roiPercentage} %
              </td>


              <td>
                {item.date?.slice(0,10)}
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