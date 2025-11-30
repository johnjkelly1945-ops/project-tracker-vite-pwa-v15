/* ======================================================================
   METRA – DevAddItemPopup.jsx
   v1 – Identical UI to AddItemPopup but for Development Tasks
   ====================================================================== */

import React, { useState } from "react";
import "../Styles/AddItemPopup.css";

export default function DevAddItemPopup({ onAdd, onClose }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({ title });
    setTitle("");
  };

  return (
    <div className="additem-overlay">
      <div className="additem-window">

        <div className="additem-header">
          <h3>Add Development Task</h3>
          <button className="additem-close-btn" onClick={onClose}>✕</button>
        </div>

        <form className="additem-body" onSubmit={handleSubmit}>
          <label>Task Title</label>
          <input
            type="text"
            className="additem-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title…"
          />

          <button className="additem-submit-btn" type="submit">
            Add Task
          </button>
        </form>

      </div>
    </div>
  );
}
