import { useEffect, useState } from "react";

function ReferralTree() {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/users/referrals", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("🔥 Tree Data:", data); // ✅ CHECK IN CONSOLE
        setTree(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("❌ Error:", err);
        setLoading(false);
      });
  }, []);

  // 🔁 Recursive Tree Render
  const renderTree = (nodes) => {
    return (
      <ul>
        {nodes.map((node, index) => (
          <li key={index}>
            👤 {node.name}

            {node.referrals && node.referrals.length > 0 && (
              renderTree(node.referrals)
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h2>Referral Tree</h2>

      {loading ? (
        <p>Loading...</p>
      ) : tree.length > 0 ? (
        renderTree(tree)
      ) : (
        <p>No referrals found</p>
      )}
    </div>
  );
}

export default ReferralTree;