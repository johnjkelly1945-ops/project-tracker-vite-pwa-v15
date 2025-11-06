import React, { useState } from "react";

export default function GovernanceProgrammeDashboard() {
  const [selected, setSelected] = useState("");

  const handleClick = (label) => {
    console.log("CLICKED:", label);
    setSelected(label);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Diagnostic Drill-Down Click Test</h2>
      <div style={{ display: "flex", gap: "1rem" }}>
        {["On Track", "At Risk", "Off Track"].map((label) => (
          <button
            key={label}
            onClick={() => handleClick(label)}
            style={{
              padding: "1rem 2rem",
              fontSize: "1rem",
              borderRadius: "0.5rem",
              border: "2px solid #0a2b5c",
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "2rem", fontSize: "1.25rem" }}>
        Selected: <strong>{selected || "(none yet)"}</strong>
      </div>
    </div>
  );
}
