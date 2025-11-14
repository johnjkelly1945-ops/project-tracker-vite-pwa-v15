/* ======================================================================
   METRA – PersonnelOverlay.jsx
   Step 7 – Stable Assign-Person Modal (Layered Under PersonnelDetail)
   ====================================================================== */

import React from "react";
import "../Styles/PersonnelOverlay.css";

export default function PersonnelOverlay({ onSelect, onClose }) {
  
  /* In future we may load this list dynamically from Personnel module */
  const people = [
    "Alice Morgan",
    "James Walker",
    "Robert Mills",
    "Sarah Connor",
    "Emily Clarke",
    "David Harris"
  ];

  return (
    <div className="po-backdrop">
      <div className="po-card">

        <h2 className="po-title">Assign Person</h2>

        {/* Person List */}
        <div className="po-list">
          {people.map((p, i) => (
            <div
              key={i}
              className="po-person"
              onClick={() => onSelect(p)}
            >
              {p}
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
