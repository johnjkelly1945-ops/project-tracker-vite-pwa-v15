// src/components/Summary.jsx
import React from "react";

export default function Summary() {
  const openPreProject = () => {
    window.open(
      "/preproject",
      "_blank",
      "width=850,height=950,scrollbars=yes,resizable=yes"
    );
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>METRA Summary Dashboard</h1>
      <p>This is your main overview page. Each module can open in its own window.</p>
      <button
        onClick={openPreProject}
        style={{
          background: "#007bff",
          color: "white",
          padding: "10px 18px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontSize: "1rem",
          marginTop: "20px",
        }}
      >
        Open PreProject Window
      </button>
    </div>
  );
}
