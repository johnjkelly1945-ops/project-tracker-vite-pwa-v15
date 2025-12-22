/* ======================================================================
   METRA – ModuleHeader.jsx
   Stable v4 – Workspace Shell Header
   ----------------------------------------------------------------------
   Provides:
   ✔ Default application identity (METRA — Workspace)
   ✔ Optional module-specific title override
   ✔ Right-side action buttons (intent-only)
   ====================================================================== */

import React from "react";
import "../Styles/ModuleHeader.css";

export default function ModuleHeader({ title, rightButtons = [] }) {
  const displayTitle = title || "METRA — Workspace";

  return (
    <div className="mh-wrapper">
      
      <div className="mh-title">
        {displayTitle}
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
