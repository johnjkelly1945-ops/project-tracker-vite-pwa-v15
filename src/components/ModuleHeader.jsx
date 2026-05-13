/*
=====================================================================
METRA — ModuleHeader.jsx
Canonical Workspace Header
---------------------------------------------------------------------
• Displays workspace title only
• No navigation controls
• Navigation is realised exclusively via canonical arrow affordances
• Stateless: no authority, no workflow, no diagnostics

Stage 480 — Operational Visibility Lensing
---------------------------------------------------------------------
• Single-mode operational visibility lens only
• Dual-mode remains orientation-only
• Projection-only filtering
• No workflow mutation
• No governance mutation
=====================================================================
*/

export default function ModuleHeader({
  activeFilter = null,
  onChangeFilter,
}) {
  const baseStyle = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "12px 16px",
    background: "#003366",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    borderBottom: "2px solid #001a33",
  };

  return (
    <div style={baseStyle}>
      <div>
        METRA — Workspace
      </div>
    </div>
  );
}
