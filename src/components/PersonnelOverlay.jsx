/* ======================================================================
   METRA – PersonnelOverlay.jsx
   Version: v6.2 – Clean + String-Only Assignment
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Provides a simple list of personnel names
   ✔ Returns ONLY the name string to PreProject.jsx
   ✔ No editing, no files, no history, no detail pane
   ✔ Clean overlay that matches TaskPopup visual style
   ====================================================================== */

import React from "react";
import "../Styles/PreProject.css";

export default function PersonnelOverlay({ onSelect, onClose }) {

  /* -------------------------------------------------------------------
     Personnel list (placeholder for now; easily upgradable later)
     ------------------------------------------------------------------- */
  const people = [
    { id: "pers-alice", name: "Alice Robertson" },
    { id: "pers-bob", name: "Bob McKenzie" },
    { id: "pers-charlie", name: "Charlie Singh" },
    { id: "pers-diana", name: "Diana Moreland" }
  ];

  return (
    <div className="pp-person-overlay">
      <div className="pp-person-window">

        {/* Header */}
        <div className="pp-person-header">
          <h3>Select Person</h3>
          <button className="pp-person-close" onClick={onClose}>×</button>
        </div>

        {/* List */}
        <div className="pp-person-list">
          {people.map((p) => (
            <div
              key={p.id}
              className="pp-person-item"
              onClick={() => onSelect(p.name)}
            >
              {p.name}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
