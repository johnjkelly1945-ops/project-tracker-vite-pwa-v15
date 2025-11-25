/* =============================================================================
   METRA – PersonnelOverlay.jsx
   v5.3 Reconstructed (Clean Build for DualPane)
   -----------------------------------------------------------------------------
   FUNCTIONS:
   • Appears ABOVE TaskPopup (z-index 10050)
   • Selecting a person updates assignedPerson
   • Adds timeline entry: "• Assigned to <Name> – <timestamp>"
   • Overlay closes, popup remains open
   • Safari + Chrome safe
   ============================================================================= */

import React from "react";
import "../Styles/PersonnelOverlay.css";

export default function PersonnelOverlay({ visible = true, people, onSelect, onClose }) {
  if (!visible) return null;

  return (
    <div className="personnel-overlay-backdrop">
      <div className="personnel-overlay-box">

        {/* Header */}
        <div className="personnel-overlay-header">
          <span className="personnel-title">Assign Person</span>
          <button className="personnel-close" onClick={onClose}>×</button>
        </div>

        {/* People List */}
        <div className="personnel-list">
          {people && people.length > 0 ? (
            people.map((p) => (
              <div
                key={p.id}
                className="personnel-item"
                onClick={() => onSelect(p.name)}
              >
                {p.name}
              </div>
            ))
          ) : (
            <div className="personnel-empty">No personnel found</div>
          )}
        </div>

      </div>
    </div>
  );
}
