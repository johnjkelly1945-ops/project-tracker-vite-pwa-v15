/* ======================================================================
   METRA – PopupUniversal.jsx
   Branch: feature-popup-universal-framework-v1
   Derived from: baseline-2025-11-16-changecontrol-popup-timestamp-only-v9.9A.9-final
   ----------------------------------------------------------------------
   - Reusable popup overlay for all METRA modules
   - Props: visible, title, onClose, onSave
   - Contains editable text area + timestamp
   - Styled with native METRA CSS variables and layout classes
   ====================================================================== */

import React, { useState, useEffect } from "react";
import "../Styles/Checklist.css"; // carries base popup colours and shadows

export default function PopupUniversal({ visible, title = "Entry", onClose, onSave }) {
  const [content, setContent] = useState("");
  const [timestamp, setTimestamp] = useState("");

  // set timestamp when popup becomes visible
  useEffect(() => {
    if (visible) {
      const now = new Date().toUTCString();
      setTimestamp(now);
      setContent("");
    }
  }, [visible]);

  if (!visible) return null;

  const handleSave = () => {
    const entry = { text: content, timestamp };
    if (onSave) onSave(entry);
    if (onClose) onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <div className="popup-header">
          <h2>{title}</h2>
          <button className="popup-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="popup-body">
          <label className="popup-label">Notes / Comms</label>
          <textarea
            className="popup-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add comment or update..."
          />
          <div className="popup-timestamp">🕒 {timestamp}</div>
        </div>

        <div className="popup-footer">
          <button className="popup-btn save" onClick={handleSave}>
            Save
          </button>
          <button className="popup-btn cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
