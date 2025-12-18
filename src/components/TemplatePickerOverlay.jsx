/* ======================================================================
   METRA – TemplatePickerOverlay
   Stage 10.3 / 10.4 – Pipeline + Persistence
   ----------------------------------------------------------------------
   PURPOSE:
   • Explicit template selection
   • Guaranteed visibility (inline styles)
   • No persistence logic
   • No workspace coupling
   ====================================================================== */

import React from "react";
import { templateLibrary } from "../repository/templateLibrary";

export default function TemplatePickerOverlay({ onSelect, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "16px",
          borderRadius: "8px",
          width: "320px",
          maxHeight: "70vh",
          overflowY: "auto",
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)"
        }}
      >
        <h3 style={{ marginTop: 0 }}>Select a Template</h3>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {templateLibrary.map((tpl) => (
            <li key={tpl.id} style={{ marginBottom: "8px" }}>
              <button
                style={{ width: "100%", padding: "6px" }}
                onClick={() => onSelect(tpl)}
              >
                {tpl.title}
              </button>
            </li>
          ))}
        </ul>

        <button
          style={{ marginTop: "12px", width: "100%" }}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
