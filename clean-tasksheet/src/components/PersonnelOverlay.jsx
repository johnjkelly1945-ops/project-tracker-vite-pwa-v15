/* ======================================================================
   METRA – PersonnelOverlay.jsx
   Restored Stable Version (Step 6H + Micro-Fixes)
   ----------------------------------------------------------------------
   • Select personnel for a task
   • Passes selection back to PreProject.jsx
   • Clean centred modal, Safari-safe
   ====================================================================== */

import React from "react";
import "../Styles/PersonnelOverlay.css";

export default function PersonnelOverlay({ onSelect, onClose }) {
  const people = ["Alice Morgan", "David Chen", "Priya Patel"];

  return (
    <div className="po-backdrop">
      <div className="po-card">

        <h2 className="po-title">Select Personnel</h2>

        <div className="po-list">
          {people.map((name) => (
            <div
              key={name}
              className="po-person"
              onClick={() => onSelect(name)}
            >
              {name}
            </div>
          ))}
        </div>

        <button className="po-close-btn" onClick={onClose}>
          Close
        </button>

      </div>
    </div>
  );
}
