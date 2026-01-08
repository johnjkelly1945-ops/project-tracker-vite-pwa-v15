// @ts-nocheck
/*
=====================================================================
METRA — Sidebar.jsx
=====================================================================

STAGE
---------------------------------------------------------------------
Stage 86.3 — Sidebar Read-Only Structure (Inert)

PURPOSE
---------------------------------------------------------------------
Provide a visible, populated sidebar structure representing METRA
modules and sub-modules. Sidebar remains strictly non-authoritative
and inert.

CONSTRAINTS (LOCKED)
---------------------------------------------------------------------
• No task logic
• No summary logic
• No navigation
• No routing
• No data mutation
• No event emission
• UI-only, visual structure
=====================================================================
*/

export default function Sidebar({ expanded, onToggle }) {
  return (
    <aside
      style={{
        width: expanded ? "240px" : "48px",
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

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              
              {/* Governance */}
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
                  <div>Risks</div>
                  <div>Issues</div>
                  <div>Escalation</div>
                </div>
              </div>

              {/* Other modules */}
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
