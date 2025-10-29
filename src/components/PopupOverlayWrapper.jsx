/* ======================================================================
   METRA – PopupOverlayWrapper.jsx
   Phase 3 – Step 2 Popup Embed Integration
   ----------------------------------------------------------------------
   • Hosts PopupUniversal inside overlay shell
   • Passes task data and Save / Close callbacks
   • Dark background + blur effect for focus
   ====================================================================== */

import React from "react";
import PopupUniversal from "./PopupUniversal.jsx";
import "../Styles/PreProject.css";

export default function PopupOverlayWrapper({ task, onClose, onSave }) {
  if (!task) return null;

  return (
    <div className="overlay-backdrop">
      <div className="overlay-container">
        <PopupUniversal task={task} onClose={onClose} onSave={onSave} />
      </div>
    </div>
  );
}

