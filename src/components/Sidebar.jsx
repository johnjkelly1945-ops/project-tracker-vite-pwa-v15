// @ts-nocheck
/*
=====================================================================
METRA — Sidebar.jsx
=====================================================================

STAGE
---------------------------------------------------------------------
Stage 312 — QC Governance Integration & Lifecycle Transparency

PURPOSE
---------------------------------------------------------------------
Extend Governance surface to include Quality Control register as a peer
inspection-only reveal intent. Sidebar remains:

• Non-authoritative
• Projection-only
• Intent emission only
• Free of reveal rendering logic
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
                  <div
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => emitRegisterReveal("change")}
                  >
                    Change Control
                  </div>

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

                  <div
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => emitRegisterReveal("qc")}
                  >
                    Quality Control
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

              <SidebarArtefactRegister artefacts={derivedArtefacts} />

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
