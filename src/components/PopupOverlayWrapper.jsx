/* ======================================================================
   METRA – PopupOverlayWrapper.jsx
   Phase 3.3 – Audit-Linked Integration Support
   ----------------------------------------------------------------------
   • Hosts PopupUniversal
   • Adds fade animation & stronger blur
   • Provides default onSave handler if none supplied by parent
   • Ensures silent localStorage save when parent callback is missing
   ====================================================================== */

import React from "react";
import PopupUniversal from "./PopupUniversal.jsx";
import "../Styles/PreProject.css";

export default function PopupOverlayWrapper({ task, onClose, onSave }) {
  if (!task) return null;

  // ------------------------------------------------------------
  // Default save handler – ensures popup can operate independently
  // ------------------------------------------------------------
  const handleSave = (updatedTask) => {
    if (onSave && typeof onSave === "function") {
      // Normal behaviour – propagate to parent
      onSave(updatedTask);
    } else {
      // Fallback behaviour – localStorage persistence
      console.log(
        "ℹ️ PopupOverlayWrapper: No onSave function provided. Task stored locally:",
        updatedTask
      );

      try {
        localStorage.setItem(
          `metra_preproject_task_${updatedTask.id || "temp"}`,
          JSON.stringify(updatedTask)
        );
      } catch (error) {
        console.error("⚠️ PopupOverlayWrapper: Failed to store task in localStorage.", error);
      }
    }
  };

  // ------------------------------------------------------------
  // Render overlay and popup container
  // ------------------------------------------------------------
  return (
    <div className="overlay-backdrop overlay-fade">
      <div className="overlay-container">
        <PopupUniversal task={task} onClose={onClose} onSave={handleSave} />
      </div>
    </div>
  );
}
