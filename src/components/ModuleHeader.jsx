/*
=====================================================================
METRA — ModuleHeader.jsx
Canonical Workspace Header
---------------------------------------------------------------------
• Displays workspace title only
• No navigation controls
• Navigation is realised exclusively via canonical arrow affordances
• Stateless: no authority, no workflow, no diagnostics
=====================================================================
*/

export default function ModuleHeader() {
  const baseStyle = {
    display: "flex",
    alignItems: "center",
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
      <div>METRA — Workspace</div>
    </div>
  );
}
