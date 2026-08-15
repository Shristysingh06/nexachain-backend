import { useEffect, useState } from "react";

function ReferralTree() {

  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const token = localStorage.getItem("token");


    fetch("http://localhost:5000/api/referral/my", {

      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`
      }

    })

    .then(res => res.json())

    .then(data => {

      console.log("🔥 Referral Data:", data);

      setTree(data);

      setLoading(false);

    })

    .catch(err => {

      console.log("Referral Error:", err);

      setLoading(false);

    });


  }, []);



  return (

    <div>

      <h2>Referral Tree</h2>


      {
        loading ?

        <p>Loading...</p>

        :

        tree.length > 0 ?

        (
          <ul>

          {
            tree.map((item,index)=>(

              <li key={index}>

                User ID: {item.referredUser}

              </li>

            ))
          }

          </ul>
        )

        :

        <p>No referrals found</p>
      }


    </div>

  );

}


export default ReferralTree;