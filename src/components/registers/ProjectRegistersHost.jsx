// @ts-nocheck
/*
=====================================================================
METRA — ProjectRegistersHost.jsx
=====================================================================

Stage:
278A — Project Registers Host Surface (Read-Only)

Purpose:
Provide an inert, read-only host container for Project Registers,
rendered exclusively within the Dual Pane management body.

This component:
• Owns no authority
• Introduces no lifecycle
• Performs no derivation
• Contains no interaction
• Renders a canonical empty state only

=====================================================================
*/

export default function ProjectRegistersHost() {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "4px",
        padding: "16px",
        background: "#fafafa",
      }}
    >
      <div style={{ fontWeight: "600", marginBottom: "8px" }}>
        Project Registers
      </div>

      <div style={{ fontSize: "13px", color: "#777" }}>
        No project registers available.
      </div>
    </div>
  );
}
