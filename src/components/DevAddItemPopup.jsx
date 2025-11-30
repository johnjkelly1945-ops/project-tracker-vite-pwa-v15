/* ======================================================================
   METRA – DevAddItemPopup.jsx
   v1.1 – FIXED: Fullscreen Overlay + Correct Positioning
   ====================================================================== */

import React, { useState } from "react";
import "../Styles/AddItemPopup.css";   // same styling

export default function DevAddItemPopup({ onAdd, onClose }) {

  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (trimmed === "") return;
    onAdd({ title: trimmed });
  };

  return (
    <div className="additem-overlay">         {/* FULLSCREEN OVERLAY */}
      <div className="additem-window">        {/* CENTRED POPUP BOX */}

        <h3 className="additem-title">Add Development Task</h3>

        <input
          className="additem-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />

        <div className="additem-buttons">
          <button className="additem-btn" onClick={handleSubmit}>
            Add Task
          </button>
          <button className="additem-btn cancel" onClick={onClose}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
