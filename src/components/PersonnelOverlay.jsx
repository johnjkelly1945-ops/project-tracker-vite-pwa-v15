/* ======================================================================
   METRA – PersonnelOverlay.jsx
   Clean React Component (No CSS inside)
   ====================================================================== */

import React from "react";
import "../Styles/PersonnelOverlay.css";   // Loads the CSS correctly

export default function PersonnelOverlay({ onSelect, onClose }) {
  const people = [
    "Alice Robertson",
    "Bob McKenzie",
    "Charlie Singh",
    "Diana Moreland"
  ];

  return (
    <div className="personnel-overlay">
      <div className="personnel-window">

        {/* HEADER */}
        <div className="personnel-header">
          <h2>Select Person</h2>
          <button className="personnel-close" onClick={onClose}>✕</button>
        </div>

        {/* PERSON LIST */}
        <div className="personnel-list">
          {people.map((p) => (
            <div
              key={p}
              className="personnel-item"
              onClick={() => onSelect(p)}
            >
              {p}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
