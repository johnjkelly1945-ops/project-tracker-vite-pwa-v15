// @ts-nocheck
/*
=====================================================================
METRA — SidebarArtefactRegister.jsx
=====================================================================

STAGE
---------------------------------------------------------------------
Stage 271 — Sidebar Derived Register of Task-Linked Artefacts

PURPOSE
---------------------------------------------------------------------
Render a read-only, projection-only register of artefact links
(Documents and Templates) derived externally from immutable
task-level system events.

AUTHORITATIVE CONSTRAINTS
---------------------------------------------------------------------
• Render-only component
• No derivation logic
• No parsing of task notes
• No mutation
• No navigation
• No click or hover handlers
• No authority or lifecycle semantics
=====================================================================
*/

export default function SidebarArtefactRegister({ artefacts = [] }) {
  if (!Array.isArray(artefacts) || artefacts.length === 0) {
    return null;
  }

  const documents = artefacts.filter((a) => a.type === "Document");
  const templates = artefacts.filter((a) => a.type === "Template");

  return (
    <div style={{ marginTop: "12px" }}>
      <div style={{ fontWeight: "600", marginBottom: "6px" }}>
          Documents (Read-Only)
      </div>

      {documents.length > 0 && (
        <div style={{ marginBottom: "8px" }}>
          <div style={{ fontWeight: "500", fontSize: "12px" }}>
            Documents
          </div>
          <ul style={{ marginLeft: "12px", paddingLeft: "0" }}>
            {documents.map((d, idx) => (
              <li key={`doc-${idx}`} style={{ fontSize: "12px" }}>
                {d.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {templates.length > 0 && (
        <div>
          <div style={{ fontWeight: "500", fontSize: "12px" }}>
            Templates
          </div>
          <ul style={{ marginLeft: "12px", paddingLeft: "0" }}>
            {templates.map((t, idx) => (
              <li key={`tpl-${idx}`} style={{ fontSize: "12px" }}>
                {t.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
