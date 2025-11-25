/* =============================================================================
   METRA – TaskPopup.jsx
   v5.3 Reconstructed (Clean Build for DualPane)
   ============================================================================= */

import React, { useState, useEffect } from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({
  visible,
  task,
  onClose,
  onChangePerson,
  onUpdateTask
}) {
  if (!visible || !task) return null;

  /* ---------------------------------------------------------------------------
     RE-RENDER TICK (cursor blink)
  --------------------------------------------------------------------------- */
  const [, force] = useState(0);
  useEffect(() => {
    const t = setInterval(() => force(v => v + 1), 1000);
    return () => clearInterval(t);
  }, []);

  /* ---------------------------------------------------------------------------
     APPEND ENTRY
  --------------------------------------------------------------------------- */
  const addEntry = (text) => {
    const entry = { text, timestamp: Date.now() };

    const updated = {
      ...task,
      entries: [...task.entries, entry]
    };

    onUpdateTask(updated);
  };

  /* ---------------------------------------------------------------------------
     TIMESTAMP FORMATTER
  --------------------------------------------------------------------------- */
  const fmt = (ts) =>
    new Date(ts).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

  const assignLabel = task.assignedPerson ? "Change Person" : "Assign";

  /* ---------------------------------------------------------------------------
     RENDER
  --------------------------------------------------------------------------- */
  return (
    <div className="popup-backdrop">
      <div className="popup-container">

        {/* HEADER */}
        <div className="popup-header">
          <h2 className="popup-title">{task.title}</h2>
          <span className="popup-assigned">{task.assignedPerson || ""}</span>
          <button className="popup-close" onClick={onClose}>×</button>
        </div>

        {/* CONTENT */}
        <div className="popup-content">

          <div className="log-heading">Entries:</div>

          {(task.entries || []).map((e, i) => (
            <div key={i} className="log-entry">
              {e.text}
              <span className="log-timestamp">
                {"  "}*[{fmt(e.timestamp)}]*
              </span>
            </div>
          ))}

          <div className="log-cursor">|</div>
        </div>

        {/* FOOTER */}
        <div className="popup-footer">

          <div className="footer-row">
            <span onClick={() => addEntry("• CC")}>CC</span>
            <span onClick={() => addEntry("• QC")}>QC</span>
            <span onClick={() => addEntry("• Risk")}>Risk</span>
            <span onClick={() => addEntry("• Issue")}>Issue</span>
            <span onClick={() => addEntry("• Escalate")}>Escalate</span>
            <span onClick={() => addEntry("• Email")}>Email</span>
            <span onClick={() => addEntry("• Docs")}>Docs</span>
            <span onClick={() => addEntry("• Template")}>Template</span>
          </div>

          <div className="footer-row">
            <span onClick={onChangePerson}>{assignLabel}</span>
            <span onClick={() => addEntry("• Mark Completed")}>
              Mark Completed
            </span>
            <span onClick={() => addEntry("• Delete")}>Delete</span>
          </div>

        </div>

      </div>
    </div>
  );
}
