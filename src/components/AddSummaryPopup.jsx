/* ======================================================================
   METRA – AddSummaryPopup.jsx
   v1.0 – Summary Creation Popup
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Simple, clean popup for creating a new Summary
   ✔ User enters title only
   ✔ On Add → returns { title }
   ✔ No status, no person, no grouping logic (handled in DualPane)
   ✔ Visual style matches AddItemPopup
   ====================================================================== */

import React, { useState } from "react";
import "../Styles/AddItemPopup.css";   // Reuse existing popup styling

export default function AddSummaryPopup({ onAdd, onClose }) {
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (trimmed === "") return;
    onAdd({ title: trimmed });
  };

  return (
    <div className="additem-overlay">
      <div className="additem-window">

        {/* Header */}
        <div className="additem-header">
          <h3>Add Summary</h3>
          <button className="additem-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Input */}
        <div className="additem-body">
          <label className="additem-label">Summary Title</label>
          <input
            className="additem-input"
            type="text"
            placeholder="Enter summary title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Footer */}
        <div className="additem-footer">
          <button className="additem-add-btn" onClick={handleSubmit}>
            Add Summary
          </button>
          <button className="additem-cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
