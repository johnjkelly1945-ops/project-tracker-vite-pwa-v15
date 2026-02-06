// @ts-nocheck
/*
=====================================================================
METRA — ProjectRegisters.jsx
=====================================================================

STAGE
---------------------------------------------------------------------
Stage 277 — Project Registers Host (Read-Only)

PURPOSE
---------------------------------------------------------------------
Provide a neutral, read-only host surface for Project Registers
and Logs, rendered exclusively within the Dual Pane workspace.

This component:
• Owns no authority
• Introduces no lifecycle
• Implements no workflow
• Performs no derivation
• Accepts derived data only
• Renders meaningful empty states

AUTHORITATIVE CONSTRAINTS
---------------------------------------------------------------------
• Read-only
• Dual-pane only (injected as pane body)
• No sidebar access
• No single-pane view
• No mutation
• No navigation
• No register-specific semantics
=====================================================================
*/

export default function ProjectRegisters({ registers = [] }) {
  if (!Array.isArray(registers) || registers.length === 0) {
    return (
      <div style={{ color: "#666", fontStyle: "italic" }}>
        No project registers available.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {registers.map((r, idx) => (
        <div
          key={idx}
          style={{
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            background: "#fafafa",
          }}
        >
          <div style={{ fontWeight: "600", marginBottom: "4px" }}>
            {r.title}
          </div>

          {Array.isArray(r.items) && r.items.length === 0 && (
            <div style={{ fontSize: "13px", color: "#777" }}>
              Empty register.
            </div>
          )}

          {Array.isArray(r.items) && r.items.length > 0 && (
            <div style={{ fontSize: "13px", color: "#333" }}>
              {r.items.length} entries
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
