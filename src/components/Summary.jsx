// src/components/Summary.jsx
import React, { useEffect, useState } from "react";
import { getOpenWindows, setWindowStatus, closeAllWindows } from "../utils/windowTracker";

export default function Summary() {
  const [openWindows, setOpenWindows] = useState(getOpenWindows());

  // Listen for updates when other windows change
  useEffect(() => {
    const update = () => setOpenWindows(getOpenWindows());
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

  // Open a module window
  const openWindow = (name, path) => {
    const win = window.open(
      `${window.location.origin}${path}`,
      "_blank",
      "width=850,height=950,scrollbars=yes,resizable=yes"
    );
    if (win) {
      window[`${name}Window`] = win;
      setWindowStatus(name, true);
      win.onbeforeunload = () => setWindowStatus(name, false);
    }
  };

  // Close a specific window
  const closeWindow = (name) => {
    const ref = window[`${name}Window`];
    if (ref && !ref.closed) ref.close();
    setWindowStatus(name, false);
  };

  // Indicator dot style
  const indicatorStyle = (isOpen) => ({
    display: "inline-block",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    marginRight: "8px",
    background: isOpen ? "limegreen" : "lightgray",
    border: "1px solid #555",
  });

  // Button styling
  const buttonStyle = {
    marginLeft: "8px",
    padding: "4px 8px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  // Render each module row
  const renderRow = (name, label, path) => (
    <div key={name} style={{ marginBottom: "10px" }}>
      <span style={indicatorStyle(openWindows[name])}></span>
      {label}
      {!openWindows[name] && (
        <button
          onClick={() => openWindow(name, path)}
          style={{ ...buttonStyle, background: "#007bff", color: "white" }}
        >
          Open
        </button>
      )}
      {openWindows[name] && (
        <button
          onClick={() => closeWindow(name)}
          style={{ ...buttonStyle, background: "#d9534f", color: "white" }}
        >
          Close
        </button>
      )}
    </div>
  );

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>METRA Summary Dashboard</h1>
      <p>Monitor open modules and control their windows.</p>

      <div style={{ marginTop: "30px" }}>
        {renderRow("preproject", "PreProject", "/preproject")}
        {renderRow("progress", "Progress", "/progress")}
        {renderRow("personnel", "Personnel", "/personnel")}
        {renderRow("closure", "Closure", "/closure")}
      </div>

      <button
        onClick={closeAllWindows}
        style={{
          background: "#d9534f",
          color: "white",
          padding: "8px 14px",
          border: "none",
          borderRadius: "6px",
          marginTop: "25px",
          cursor: "pointer",
        }}
      >
        Close All Windows
      </button>
    </div>
  );
}
