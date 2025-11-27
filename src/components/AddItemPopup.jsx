/* ======================================================================
   METRA – AddItemPopup.jsx
   v7 A2 – restored from last verified stable logic (v4.6B.13)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Popup for adding new tasks
   ✔ Simple title input + validation
   ✔ Clean overlay styling
   ✔ Works with PreProject.jsx (A2)
   ====================================================================== */

import React, { useState } from "react";
import "../Styles/AddItemPopup.css";

export default function AddItemPopup({ onAdd, onClose }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title });
    onClose();
  };

  return (
    <div className="additem-overlay">
      <div className="additem-window">

        {/* HEADER */}
        <div className="additem-header">
          <h3>Add New Task</h3>
          <button className="additem-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="additem-form">

          <label>Task Title</label>
          <input
            type="text"
            value={title}
            placeholder="Enter task title"
            onChange={(e) => setTitle(e.target.value)}
            className="additem-input"
            autoFocus
          />

          <button type="submit" className="additem-submit-btn">
            Add Task
          </button>

        </form>

      </div>
    </div>
  );
}
