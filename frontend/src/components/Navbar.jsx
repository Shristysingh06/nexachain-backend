
import React from "react";

const Navbar = () => {
  return (
    <div style={styles.nav}>
      <h2>💰 Investment App</h2>
      <button style={styles.logout}>Logout</button>
    </div>
  );
};

const styles = {
  nav: {
    height: "60px",
    background: "#111",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px"
  },
  logout: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    cursor: "pointer"
  }
};

export default Navbar;