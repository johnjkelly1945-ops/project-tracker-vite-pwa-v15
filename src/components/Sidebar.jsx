// @ts-nocheck
/*
=====================================================================
METRA — Sidebar.jsx
=====================================================================

STAGE
---------------------------------------------------------------------
Stage 86.3 — Sidebar Read-Only Structure (Inert)
(Stage 160 — UI-only width refinement applied)
Stage 271 — Sidebar Derived Register of Task-Linked Artefacts (Projection Only)
Stage 280 — Sidebar Register Reveal Intent Emission (NON-AUTHORITATIVE)
Stage 286 — Governance Risks Register (Reveal Intent Added)
Stage 290 — Governance Issues Register (Reveal Intent Added)

PURPOSE
---------------------------------------------------------------------
Provide a visible, populated sidebar structure representing METRA
modules and sub-modules.

The Sidebar MAY emit inspection-only reveal intent events for
governance registers. The Sidebar remains strictly:
• Non-authoritative
• Projection-only
• Non-navigational
• Free of reveal rendering logic

AUTHORITATIVE CONSTRAINTS
---------------------------------------------------------------------
• No workspace mutation
• No navigation or routing
• No reveal rendering
• Intent emission only
• SEM-NR-01 preserved
=====================================================================
*/

import SidebarArtefactRegister from "./sidebar/SidebarArtefactRegister";

function emitRegisterReveal(register) {
  window.dispatchEvent(
    new CustomEvent("metra:register:reveal", {
      detail: { register },
    })
  );
}

export default function Sidebar({ expanded, onToggle, derivedArtefacts = [] }) {
  return (
    <aside
      style={{
        width: expanded ? "180px" : "48px",
        transition: "width 0.2s ease",
        borderRight: "1px solid #ccc",
        background: "#f7f7f7",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: expanded ? "space-between" : "center",
          padding: expanded ? "0 12px" : "0",
          borderBottom: "1px solid #ddd",
        }}
      >
        {expanded && (
          <strong style={{ fontSize: "14px" }}>Sidebar</strong>
        )}

        <button
          type="button"
          onClick={onToggle}
          aria-label="Toggle sidebar"
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {expanded ? "‹" : "›"}
        </button>
      </div>

      {/* Body — populated but inert */}
      <div
        style={{
          flex: 1,
          padding: expanded ? "12px" : "0",
          fontSize: "13px",
          color: "#333",
        }}
      >
        {expanded && (
          <>
            <div style={{ marginBottom: "12px", fontWeight: "bold" }}>
              Modules
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {/* Governance (intent-only) */}
              <div>
                <div style={{ fontWeight: "600" }}>Governance</div>
                <div
                  style={{
                    marginTop: "6px",
                    marginLeft: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    color: "#555",
                  }}
                >
                  <div>Change Control</div>

                  <div
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => emitRegisterReveal("risks")}
                  >
                    Risks
                  </div>

                  <div
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => emitRegisterReveal("issues")}
                  >
                    Issues
                  </div>

                  <div>Escalation</div>

                  <div
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => emitRegisterReveal("artefacts")}
                  >
                    Artefacts
                  </div>
                </div>
              </div>

              {/* ================= Derived Artefacts (Read-Only) ================= */}
              <SidebarArtefactRegister artefacts={derivedArtefacts} />

              {/* Other modules (static placeholders) */}
              <div>Template Repository</div>
              <div>Summary / Task Repository</div>
              <div>Personnel</div>
              <div>Help</div>
              <div style={{ opacity: 0.6 }}>Future Modules</div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
