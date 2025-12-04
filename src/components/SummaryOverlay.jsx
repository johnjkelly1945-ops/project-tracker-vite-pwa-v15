/* ======================================================================
   METRA – SummaryOverlay.jsx
   v1.4 – Correct classnames matching SummaryOverlay.css
   ====================================================================== */

import React, { useState } from "react";
import "../Styles/SummaryOverlay.css";

export default function SummaryOverlay({ onAdd, onClose }) {
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd(title.trim());
    onClose();
  };

  return (
    <div className="summary-overlay" onClick={onClose}>
      <div
        className="summary-window"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <div className="summary-header">
          <h3 className="summary-header-title">Add Summary</h3>
          <button className="summary-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="summary-body">
          <label className="summary-label">Summary Title:</label>

          <input
            type="text"
            className="summary-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter summary name…"
          />
        </div>

        {/* FOOTER */}
        <div className="summary-footer">
          <button className="summary-btn cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="summary-btn add" onClick={handleSubmit}>
            Add Summary
          </button>
        </div>

      </div>
    </div>
  );
}
