/* ======================================================================
   METRA – PopupOverlayWrapper.jsx
   Stable Overlay Container
   ----------------------------------------------------------------------
   • Hosts PopupUniversal
   • Adds fade animation & blur backdrop
   ====================================================================== */

import React from "react";
import PopupUniversal from "./PopupUniversal.jsx";
import "../Styles/PreProject.css";

export default function PopupOverlayWrapper({ task, onClose, onSave }) {
  if (!task) return null;

  return (
    <div className="overlay-backdrop overlay-fade">
      <div className="overlay-container">
        <PopupUniversal task={task} onClose={onClose} onSave={onSave} />
      </div>
    </div>
  );
}
