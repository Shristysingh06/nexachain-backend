import React from "react";

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <p>🏠 Dashboard</p>
      <p>💼 Investments</p>
      <p>👛 Wallet</p>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "200px",
    height: "100vh",
    background: "#222",
    color: "#fff",
    padding: "20px"
  }
};

export default Sidebar;