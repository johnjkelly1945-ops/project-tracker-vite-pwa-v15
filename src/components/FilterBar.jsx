/* ======================================================================
   METRA – FilterBar.jsx
   Stage 3.1 – Full Filter Bar (UI Only)
   Correct, Clean, Safe Version
   ====================================================================== */

import React from "react";
import "../Styles/FilterBar.css";

export default function FilterBar({ active, onChange }) {
  const filters = [
    { id: "all", label: "All" },
    { id: "not-started", label: "Not Started" },
    { id: "in-progress", label: "In Progress" },
    { id: "completed", label: "Completed" },
    { id: "flagged", label: "Flagged" },
    { id: "open", label: "Open" }
  ];

  return (
    <div className="filter-bar">
      {filters.map((f) => (
        <button
          key={f.id}
          className={`filter-pill ${active === f.id ? "active" : ""}`}
          onClick={() => onChange?.(f.id)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
