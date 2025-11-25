// src/components/ModuleHeader.jsx
import React from "react";
import { setWindowStatus } from "../utils/windowTracker";

export default function ModuleHeader({ moduleName }) {
  const handleClose = () => {
    setWindowStatus(moduleName.toLowerCase(), false);
    window.close();
  };

  const goToSummary = () => {
    window.location.href = "/";
  };

  const headerStyle = {
    background: "#003366",
    color: "white",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid #0055aa",
    fontFamily: "Arial, sans-serif",
  };

  const buttonStyle = {
    background: "#0055aa",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    cursor: "pointer",
    marginLeft: "10px",
  };

  return (
    <div style={headerStyle}>
      <div>
        <strong>{moduleName}</strong> Module
      </div>
      <div>
        <button style={buttonStyle} onClick={goToSummary}>
          Return to Summary
        </button>
        <button style={buttonStyle} onClick={handleClose}>
          Close Window
        </button>
      </div>
    </div>
  );
}
