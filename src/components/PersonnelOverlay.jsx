/* ======================================================================
   METRA – PersonnelOverlay.jsx
   v4.6B.14 – Logic Reintegration (Stage 2)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Provide a clean, simple personnel selector
   ✔ No dependencies yet (no popup link, no detail link)
   ✔ Standalone component so PreProject can integrate later
   ----------------------------------------------------------------------
   CURRENT BEHAVIOUR:
   – Shows a simple list of personnel
   – onSelect(name) and onClose() are provided by PreProject
     (but PreProject won’t call them yet — that’s part of Stage 4)
   ====================================================================== */

import React from "react";
import "../Styles/PreProject.css";

export default function PersonnelOverlay({ onSelect, onClose }) {
  const people = [
    { id: "p1", name: "Alice Robertson" },
    { id: "p2", name: "Bob McKenzie" },
    { id: "p3", name: "Charlie Hayes" }
  ];

  return (
    <div className="personnel-overlay">
      <div className="personnel-header">
        <span>Select Personnel</span>
        <button className="personnel-close" onClick={onClose}>×</button>
      </div>

      <div className="personnel-list">
        {people.map((p) => (
          <div
            key={p.id}
            className="personnel-line"
            onClick={() => onSelect(p.name)}
          >
            {p.name}
          </div>
        ))}
      </div>
    </div>
  );
}
