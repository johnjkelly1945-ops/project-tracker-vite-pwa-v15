/* ======================================================================
   METRA – GovernancePopup.jsx
   Phase 4.6B.13 Step 7 – Minimal Governance Summary Popup
   ----------------------------------------------------------------------
   Lightweight governance drill-down:
   - RAG status
   - Risk count
   - Issue count
   - Change count
   - Notes placeholder
   ====================================================================== */

import React from "react";
import "../Styles/PreProject.css";

export default function GovernancePopup({ task, onClose }) {
  if (!task) return null;

  // Minimal mock values for now
  const rag = "Green";
  const risks = 0;
  const issues = 0;
  const changes = 0;

  return (
    <div className="overlay-backdrop z-governance">
      <div className="overlay-card">
        <h2>Governance Summary</h2>

        <div style={{ lineHeight: "1.6", fontSize: "1rem" }}>
          <strong>Task:</strong><br />
          {task.title}<br /><br />

          <strong>RAG Status:</strong><br />
          {rag}<br /><br />

          <strong>Risks:</strong><br />
          {risks}<br /><br />

          <strong>Issues:</strong><br />
          {issues}<br /><br />

          <strong>Changes:</strong><br />
          {changes}<br /><br />

          <strong>Notes:</strong><br />
          (Governance details to be integrated in full METRA module)<br /><br />
        </div>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
