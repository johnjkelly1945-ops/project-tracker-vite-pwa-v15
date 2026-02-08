// @ts-nocheck
/*
=====================================================================
METRA — RegisterRevealLayer.jsx
=====================================================================

STAGE
---------------------------------------------------------------------
Stage 279 — Governance Registers — Global Reveal Layer (INERT)
Stage 280 — Governance Registers — Reveal Activation (INSPECTION-ONLY)

PURPOSE
---------------------------------------------------------------------
Provide a global, inspection-only overlay layer mounted via a DOM
portal outside the React workspace tree.

This implementation is StrictMode-safe and idempotent.
=====================================================================
*/

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

let listenersAttached = false;

export default function RegisterRevealLayer() {
  const host = document.getElementById("metra-register-reveal");
  const [visible, setVisible] = useState(false);
  const [activeRegister, setActiveRegister] = useState(null);

  useEffect(() => {
    if (listenersAttached) return;
    listenersAttached = true;

    function onReveal(e) {
      if (!e?.detail?.register) return;
      setActiveRegister(e.detail.register);
      setVisible(true);
    }

    function onClose() {
      setVisible(false);
      setActiveRegister(null);
    }

    window.addEventListener("metra:register:reveal", onReveal);
    window.addEventListener("metra:register:close", onClose);

    return () => {
      // Intentionally do NOT remove listeners in dev StrictMode
    };
  }, []);

  if (!host || !visible) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={() =>
        window.dispatchEvent(new CustomEvent("metra:register:close"))
      }
    >
      <div
        style={{
          background: "#ffffff",
          color: "#333",
          minWidth: "420px",
          maxWidth: "70vw",
          maxHeight: "70vh",
          overflow: "auto",
          borderRadius: "6px",
          padding: "16px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <strong style={{ fontSize: "16px" }}>
            {activeRegister === "artefacts"
              ? "Artefacts Register (Read-Only)"
              : "Register"}
          </strong>

          <button
            type="button"
            aria-label="Close register"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("metra:register:close")
              )
            }
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            ×
          </button>
        </div>

        {activeRegister === "artefacts" && (
          <div style={{ fontSize: "13px", opacity: 0.85 }}>
            This register is inspection-only. Artefact content is
            derived and read-only.
          </div>
        )}
      </div>
    </div>,
    host
  );
}
