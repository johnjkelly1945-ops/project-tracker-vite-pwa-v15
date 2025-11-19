/* ======================================================================
   METRA – PersonnelOverlay.jsx
   Extended Personnel List (Selection Overlay)
   ----------------------------------------------------------------------
   ✔ Opens when user clicks “Assign”
   ✔ Shows full extended team (8 names)
   ✔ Selecting a person immediately assigns to the task
   ✔ Closes after selection
   ✔ Safe, clean, standalone component
   ====================================================================== */

import React from "react";
import "../Styles/PersonnelOverlay.css";

export default function PersonnelOverlay({ onSelect, onClose }) {

  // ============================================================
  // EXTENDED PERSONNEL LIST (8 NAMES)
  // ============================================================
  const people = [
    { id: "pers-alice-robertson", name: "Alice Robertson" },
    { id: "pers-bob-mckenzie",  name: "Bob McKenzie" },
    { id: "pers-charlie",       name: "Charlie" },
    { id: "pers-diana-hayes",   name: "Diana Hayes" },
    { id: "pers-evan-turner",   name: "Evan Turner" },
    { id: "pers-fiona-blake",   name: "Fiona Blake" },
    { id: "pers-george-patel",  name: "George Patel" },
    { id: "pers-helen-ward",    name: "Helen Ward" }
  ];

  return (
    <div className="personnel-overlay">

      <div className="personnel-card">

        <h2 className="personnel-title">Select a Person</h2>

        {/* PERSON LIST */}
        <div className="personnel-list">
          {people.map((p) => (
            <div
              key={p.id}
              className="personnel-row"
              onClick={() => onSelect(p.name)}
            >
              {p.name}
            </div>
          ))}
        </div>

        {/* CLOSE BUTTON */}
        <button className="personnel-close-btn" onClick={onClose}>
          Close
        </button>

      </div>
    </div>
  );
}
