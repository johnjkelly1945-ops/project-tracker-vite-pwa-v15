/* ======================================================================
   METRA – PersonnelDetail.jsx
   v4.6B.14 – Logic Reintegration (Stage 3)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Provide a simple, clean personnel detail card
   ✔ No external dependencies yet
   ✔ Will be triggered later from TaskPopup
   ----------------------------------------------------------------------
   CURRENT BEHAVIOUR:
   – Renders a name and placeholder info
   – Has an onClose callback
   – Not currently activated (safe dormant component)
   ====================================================================== */

import React from "react";
import "../Styles/PreProject.css";

export default function PersonnelDetail({ person, onClose }) {
  if (!person) return null;

  return (
    <div className="personnel-detail">
      <div className="personnel-detail-header">
        <span>Personnel Detail</span>
        <button className="personnel-close" onClick={onClose}>×</button>
      </div>

      <div className="personnel-detail-body">
        <div className="personnel-detail-name">{person}</div>

        <div className="personnel-detail-info">
          <p><strong>Role:</strong> (to be defined)</p>
          <p><strong>Contact:</strong> (to be added)</p>
          <p><strong>Notes:</strong> Personnel data placeholder. This will be populated in a later module.</p>
        </div>
      </div>
    </div>
  );
}
