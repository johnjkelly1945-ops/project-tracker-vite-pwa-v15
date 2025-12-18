
/* ======================================================================
   METRA – TemplatePickerOverlay
   Stage 10.3.1A – Pipeline Test Harness
   ----------------------------------------------------------------------
   PURPOSE:
   • Minimal template selector
   • Explicit user action only
   • No persistence
   • Temporary test harness
   ====================================================================== */

import React from "react";
import { templateLibrary } from "../repository/templateLibrary";

export default function TemplatePickerOverlay({ onSelect, onClose }) {
  return (
    <div className="metra-overlay">
      <div className="metra-overlay-window">
        <h3>Select a Template</h3>

        <ul>
          {templateLibrary.map((tpl) => (
            <li key={tpl.id}>
              <button onClick={() => onSelect(tpl)}>
                {tpl.title}
              </button>
            </li>
          ))}
        </ul>

        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
