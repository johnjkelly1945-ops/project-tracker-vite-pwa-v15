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
import { getPersonnel } from "../domain/personnel/PersonnelRegistry";
import { setActingUser, getActingUser } from "../domain/actor/ActingUser";
import { canViewSurface } from "../domain/visibility/VisibilityResolver";

function emitRegisterReveal(register, segmentId) {
  window.dispatchEvent(
    new CustomEvent("metra:register:reveal", {
        detail: { register, segmentId },
    })
  );
}

function emitModuleIntent(type, payload) {
  window.dispatchEvent(
    new CustomEvent("METRA_INTENT", {
      detail: { type, payload },
    })
  );
}

export default function Sidebar({ expanded, onToggle, derivedArtefacts = [], effectiveSegmentId }) {
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
            <div style={{ marginBottom: "12px" }}>
              <select
                onChange={(e) => {
                  const personnel = getPersonnel() || [];
                  const selectedId = e.target.value;
                  const person = personnel.find(p => p.id === selectedId);
                  if (!person) return;

                  setActingUser(person);

                  try {
                    localStorage.setItem("metra_acting_user", JSON.stringify(person));
                  } catch (e) {
                    console.warn("Failed to persist actor");
                  }

                  window.location.reload();
                }}
                style={{ width: "100%" }}
              >
                <option value="">Select Actor</option>
                {(getPersonnel() || []).map(p => (
                  <option key={p.id} value={p.id}>
                    {p.displayName}
                  </option>
                ))}
              </select>
            </div>
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
                      onClick={() => emitRegisterReveal("change", effectiveSegmentId)}
                  >
                    Change Control
                  </div>

                  <div
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => emitRegisterReveal("risks", effectiveSegmentId)}
                  >
                    Risks
                  </div>

                  <div
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => emitRegisterReveal("issues", effectiveSegmentId)}
                  >
                    Issues
                  </div>

                  <div
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => emitRegisterReveal("qc", effectiveSegmentId)}
                  >
                    Quality Control
                  </div>

                    <div
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => emitModuleIntent("OPEN_GLOBAL_ESCALATION_LEDGER")}
                    >
                      Escalation
                    </div>
                      {canViewSurface({
                          actor: getActingUser(),
                        surface: "SIDEBAR_DASHBOARD",
                        context: {}
                      }) && (
                        <div
                          style={{ cursor: "pointer", textDecoration: "underline" }}
                          onClick={() => emitModuleIntent("OPEN_GOVERNANCE_DASHBOARD")}
                        >
                          Governance Dashboard
                        </div>
                      )}

                  <div
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => emitRegisterReveal("artefacts", effectiveSegmentId)}
                  >
                      Documents
                  </div>
                </div>
              </div>

              <SidebarArtefactRegister artefacts={derivedArtefacts} />

              <div>Template Repository</div>
              <div>Summary / Task Repository</div>
              <div>Personnel</div>
              <div
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => emitModuleIntent("OPEN_ARCHIVE_INTENT")}
              >
                Archive
              </div>
              <div>Help</div>
              <div style={{ opacity: 0.6 }}>Future Modules</div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
