/* ==========================================================
   SIMPLE CLICK TEST – Standalone React component
   ----------------------------------------------------------
   • Shows three coloured boxes on the page.
   • Logs a message in the Console each time any box is clicked.
   • Confirms that React event handling is working.
   ========================================================== */

import React from "react";

export default function ClickTest() {
  const handleClick = (label) => {
    console.log(`✅ Box clicked: ${label}`);
  };

  const boxStyle = {
    width: "150px",
    height: "150px",
    margin: "1rem",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    userSelect: "none",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#f4f6fa",
      }}
    >
      <div
        style={{ ...boxStyle, background: "#1565c0" }}
        onClick={() => handleClick("Blue")}
      >
        Blue Box
      </div>
      <div
        style={{ ...boxStyle, background: "#2e7d32" }}
        onClick={() => handleClick("Green")}
      >
        Green Box
      </div>
      <div
        style={{ ...boxStyle, background: "#c62828" }}
        onClick={() => handleClick("Red")}
      >
        Red Box
      </div>
    </div>
  );
}
