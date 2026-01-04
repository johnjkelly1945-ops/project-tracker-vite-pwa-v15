// @ts-nocheck
/*
=====================================================================
METRA — AssignmentModal.jsx
=====================================================================

ROLE
---------------------------------------------------------------------
Authoritative assignment execution surface (UI-only).

STAGE
---------------------------------------------------------------------
Stage 60.1 — Assignment Modal Authoritative Execution

CONSTRAINTS
---------------------------------------------------------------------
• Modal itself is non-authoritative
• No task mutation occurs here
• No lifecycle or governance interaction
• All authority exercised by parent handler
• Modal must close deterministically on confirm / cancel
=====================================================================
*/

import React from "react";

export default function AssignmentModal({
  isOpen,
  currentAssignee,
  selectedAssignee,
  onSelectAssignee,
  onConfirm,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={{ marginTop: 0 }}>Assign Task</h3>

        <div style={{ marginBottom: "12px" }}>
          <strong>Current assignment:</strong>{" "}
          {currentAssignee || "Unassigned"}
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>
            Assign to:
            <select
              value={selectedAssignee}
              onChange={(e) => onSelectAssignee(e.target.value)}
              style={selectStyle}
            >
              <option value="">— Select person —</option>
              <option value="person-1">Person 1</option>
              <option value="person-2">Person 2</option>
            </select>
          </label>
        </div>

        <div style={buttonRowStyle}>
          <button
            disabled={!selectedAssignee}
            onClick={onConfirm}
          >
            Confirm Assignment
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1100,
};

const modalStyle = {
  background: "#fff",
  padding: "20px",
  width: "360px",
  borderRadius: "6px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
};

const selectStyle = {
  display: "block",
  marginTop: "6px",
  width: "100%",
};

const buttonRowStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "8px",
};
