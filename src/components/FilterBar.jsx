/* ======================================================================
   METRA – FilterBar.jsx
   v1 – Shared Dual-Mode Filter Component (mgmt + dev)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Full pill-style filter buttons (exactly as in your screenshot)
   ✔ Works in BOTH panes via mode="mgmt" | mode="dev"
   ✔ Emits selected filter back to parent pane
   ✔ Clean, simple, eyesight-friendly layout
   ====================================================================== */

import React from "react";
import "../Styles/FilterBar.css";

export default function FilterBar({ mode, activeFilter, onChange }) {

  /* ------------------------------------------------------------------
     FILTER OPTIONS – identical for both panes
     ------------------------------------------------------------------ */
  const filters = [
    { id: "all", label: "All" },
    { id: "notstarted", label: "Not Started" },
    { id: "inprogress", label: "In Progress" },
    { id: "completed", label: "Completed" },
    { id: "flagged", label: "Flagged" },
    { id: "open", label: "Open" }
  ];

  /* ------------------------------------------------------------------
     HANDLE CLICK
     ------------------------------------------------------------------ */
  const handleClick = (filterId) => {
    if (onChange) {
      onChange(mode, filterId); // parent handles filtering
    }
  };

  /* ------------------------------------------------------------------
     RENDER
     ------------------------------------------------------------------ */
  return (
    <div className="filterbar-container">
      {filters.map((f) => (
        <button
          key={f.id}
          className={`filter-pill ${activeFilter === f.id ? "active" : ""}`}
          onClick={() => handleClick(f.id)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
