/* ======================================================================
   METRA – ModuleHeader.jsx
   Stable v3 – PreProject / Repository Header Bar
   ----------------------------------------------------------------------
   Provides:
   ✔ Title for active module
   ✔ Buttons for switching modules (if needed)
   ✔ Sticky under global header
   ====================================================================== */

import React from "react";
import "../Styles/ModuleHeader.css";

export default function ModuleHeader({ title, rightButtons = [] }) {
  return (
    <div className="mh-wrapper">
      
      <div className="mh-title">
        {title}
      </div>

      <div className="mh-right">
        {rightButtons.map((btn, index) => (
          <button
            key={index}
            className="mh-btn"
            onClick={btn.onClick}
          >
            {btn.label}
          </button>
        ))}
      </div>

    </div>
  );
}
