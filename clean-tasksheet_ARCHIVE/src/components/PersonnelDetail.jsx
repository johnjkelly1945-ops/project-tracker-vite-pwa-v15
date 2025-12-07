/* ======================================================================
   METRA – PersonnelDetail.jsx (v5 Restore)
   ----------------------------------------------------------------------
   ✔ Opens only from inside TaskPopup
   ✔ Clean centred white card
   ✔ Dimmed background overlay
   ✔ Close returns to popup
   ====================================================================== */

import React from "react";
import "../Styles/PersonnelOverlay.css";

export default function PersonnelDetail({ personName, onClose }) {
  return (
    <div className="personnel-overlay">
      <div className="personnel-card">

        <h2 className="personnel-name">{personName}</h2>

        <p style={{ marginBottom: "8px" }}>
          This is the personnel record for <strong>{personName}</strong>.
        </p>

        <p style={{ fontSize: "13px", color: "#555" }}>
          Additional personnel details will appear here when the Personnel
          module is integrated.
        </p>

        <button className="personnel-close-btn" onClick={onClose}>
          Close
        </button>

      </div>
    </div>
  );
}
