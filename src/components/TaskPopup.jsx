/* =============================================================================
   METRA – TaskPopup.jsx
   v5.3 Reconstructed (Clean Build for DualPane)
   -----------------------------------------------------------------------------
   FEATURES:
   • Header: Title — Assigned Person — Close X
   • Scrollable notes/log panel
   • Entries append at bottom
   • Timestamp auto-added
   • Blinking cursor at bottom
   • Governance actions add log entries
   • Assign / Change Person calls overlay from footer
   • Popup ALWAYS stays open
   • Fully compatible with DualPane v3.9 layout
   ============================================================================= */

import React, { useState, useEffect } from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({
  visible,
  task,
  onClose,
  onRequestPersonChange,
  onUpdateTask,
}) {
  if (!visible || !task) return null;

  /* ---------------------------------------------------------------------------
     FORCE RE-RENDER EVERY SECOND (cursor + editable window)
  --------------------------------------------------------------------------- */
  const [, force] = useState(0);
  useEffect(() => {
    const t = setInterval(() => force(v => v + 1), 1000);
    return () => clearInterval(t);
  }, []);

  /* ---------------------------------------------------------------------------
     APPEND ENTRY TO TASK
  --------------------------------------------------------------------------- */
  const addEntry = (text) => {
    const newEntry = {
      text,
      timestamp: Date.now(),
    };

    const updatedTask = {
      ...task,
      entries: [...task.entries, newEntry],
    };

    onUpdateTask(updatedTask);
  };

  /* ---------------------------------------------------------------------------
     FORMAT TIMESTAMP
  --------------------------------------------------------------------------- */
  const fmt = (ts) =>
    new Date(ts).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  /* ---------------------------------------------------------------------------
     FOOTER ACTIONS → ADD ENTRIES WITH TAG
  --------------------------------------------------------------------------- */
  const handleFooterAction = (label) => {
    addEntry(`• ${label}`);
  };

  /* ---------------------------------------------------------------------------
     ASSIGN / CHANGE PERSON LABEL
  --------------------------------------------------------------------------- */
  const assignLabel = task.assignedPerson ? "Change Person" : "Assign";

  /* ---------------------------------------------------------------------------
     RENDER
  --------------------------------------------------------------------------- */
  return (
    <div className="popup-backdrop">

      <div className="popup-container">

        {/* ------------------------------------------------------------------- */}
        {/* HEADER                                                             */}
        {/* ------------------------------------------------------------------- */}
        <div className="popup-header">
          <h2 className="popup-title">{task.title}</h2>

          <span className="popup-assigned">
            {task.assignedPerson || ""}
          </span>

          <button className="popup-close" onClick={onClose}>×</button>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* CONTENT: LOG PANEL                                                 */}
        {/* ------------------------------------------------------------------- */}
        <div className="popup-content log-scroll-area">

          <div className="log-heading">Entries:</div>

          {(task.entries || []).map((entry, index) => (
            <div key={index} className="log-entry">
              {entry.text}{" "}
              <span className="log-timestamp"> *[{fmt(entry.timestamp)}]* </span>
            </div>
          ))}

          {/* Blinking cursor at bottom */}
          <div className="log-cursor">|</div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* FOOTER                                                             */}
        {/* ------------------------------------------------------------------- */}
        <div className="popup-footer">

          <div className="footer-row">
            <span onClick={() => handleFooterAction("CC")}>CC</span>
            <span onClick={() => handleFooterAction("QC")}>QC</span>
            <span onClick={() => handleFooterAction("Risk")}>Risk</span>
            <span onClick={() => handleFooterAction("Issue")}>Issue</span>
            <span onClick={() => handleFooterAction("Escalate")}>Escalate</span>
            <span onClick={() => handleFooterAction("Email")}>Email</span>
            <span onClick={() => handleFooterAction("Docs")}>Docs</span>
            <span onClick={() => handleFooterAction("Template")}>Template</span>
          </div>

          <div className="footer-row">
            <span onClick={onRequestPersonChange}>{assignLabel}</span>
            <span onClick={() => handleFooterAction("Mark Completed")}>
              Mark Completed
            </span>
            <span onClick={() => handleFooterAction("Delete")}>Delete</span>
          </div>

        </div>
      </div>
    </div>
  );
}
