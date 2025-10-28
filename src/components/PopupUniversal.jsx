/* ======================================================================
   METRA – PopupUniversal.jsx
   Branch: feature-preproject-popup-integration-phase2
   Baseline target: baseline-2025-10-30-preproject-popup-integration-phase2-v2.1
   ----------------------------------------------------------------------
   - Fully persistent popup with Close / Save / Reset
   - Data stored in localStorage per task (key: metra_popup_<id>)
   - Clean onClose handoff to parent (PreProject)
   - Minimal styling for clarity and focus
   ====================================================================== */

import React, { useState, useEffect } from "react";
import "../Styles/PreProject.css";

export default function PopupUniversal({ taskId, taskTitle, onClose }) {
  const storageKey = `metra_popup_${taskId}`;
  const [text, setText] = useState("");

  // === Load saved text for this task ===
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setText(saved);
  }, [storageKey]);

  // === Persist text on change ===
  useEffect(() => {
    localStorage.setItem(storageKey, text);
  }, [text, storageKey]);

  const handleSave = () => {
    localStorage.setItem(storageKey, text);
    alert("Saved successfully.");
  };

  const handleReset = () => {
    if (window.confirm("Clear this entry?")) {
      setText("");
      localStorage.removeItem(storageKey);
    }
  };

  const handleClose = () => {
    onClose?.(); // Safely trigger parent close if provided
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2 className="popup-header">
          Log Entry – {taskTitle || "Untitled Task"}
        </h2>

        <textarea
          className="popup-textarea"
          placeholder="Enter your notes, communications, or audit text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="popup-actions">
          <button className="popup-btn-save" onClick={handleSave}>
            💾 Save
          </button>
          <button className="popup-btn-reset" onClick={handleReset}>
            ♻️ Reset
          </button>
          <button className="popup-btn-close" onClick={handleClose}>
            ✖ Close
          </button>
        </div>
      </div>
    </div>
  );
}
