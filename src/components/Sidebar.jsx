// @ts-nocheck
/*
=====================================================================
METRA — Sidebar.jsx
=====================================================================

STAGE
---------------------------------------------------------------------
Stage 86.2 — Sidebar Expand / Collapse (UI-Only)

PURPOSE
---------------------------------------------------------------------
Provide a collapsible sidebar shell using local UI state
passed from App. Sidebar remains non-authoritative.

CONSTRAINTS (LOCKED)
---------------------------------------------------------------------
• No task logic
• No summary logic
• No navigation
• No routing
• No data mutation
• UI-only behaviour
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

      {/* Body — intentionally empty */}
      <div style={{ flex: 1 }} />
    </aside>
  );
}
