/* =============================================================================
   METRA – PersonnelOverlay.jsx
   Final Stable Version (DualPane-Compatible)
   -----------------------------------------------------------------------------
   • Opens ABOVE TaskPopup (z-index: 15000)
   • Displays list of personnel
   • On selection:
        - Calls onSelect(person)
        - Closes immediately
        - Popup remains open underneath and updates assigned text
   ============================================================================= */

import React from "react";
import "../Styles/PersonnelOverlay.css";

export default function PersonnelOverlay({ people = [], onSelect, onClose }) {
  return (
    <div className="personnel-overlay-backdrop">

      <div className="personnel-overlay-container">

        {/* Header ----------------------------------------------------------- */}
        <div className="personnel-header">
          <h3>Select Person</h3>
          <button className="personnel-close" onClick={onClose}>×</button>
        </div>

        {/* List of people --------------------------------------------------- */}
        <div className="personnel-list">
          {people.map((p) => (
            <div
              key={p.id}
              className="personnel-item"
              onClick={() => onSelect(p)}
            >
              {p.name}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
