/*
=====================================================================
METRA — ModuleHeader.jsx
Stage 24 (Diagnostic Override)
---------------------------------------------------------------------
• FORCED visible header + dev button
• No CSS dependency
• No conditional rendering
• No semantics or persistence
• DEV / DIAGNOSTIC ONLY
=====================================================================
*/

export default function ModuleHeader({
  activeModule,
  setActiveModule,
  rightButtons = []
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        background: "#003366",
        color: "white",
        fontSize: "16px",
        fontWeight: "bold",
        borderBottom: "2px solid #001a33"
      }}
    >
      {/* LEFT: Title */}
      <div>
        METRA — Workspace — HEADER TEST ACTIVE
      </div>

      {/* RIGHT: Forced Dev Buttons */}
      <div style={{ display: "flex", gap: "8px" }}>
        {rightButtons.map((btn, index) => (
          <button
            key={index}
            onClick={btn.onClick}
            style={{
              padding: "6px 10px",
              background: "#ffcc00",
              color: "#000",
              border: "1px solid #333",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "normal"
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
