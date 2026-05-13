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
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div>METRA — Workspace</div>

        {activeFilter && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              fontSize: "11px",
              fontWeight: 500,
            }}
          >
            {[
              ["all", "ALL"],
              ["notstarted", "NOT STARTED"],
              ["started", "STARTED"],
              ["submitted", "SUBMITTED"],
              ["completed", "COMPLETED"],
              ["flagged", "FLAGGED"],
            ].map(([id, label]) => (
              <span
                key={id}
                onClick={() => {
                  if (id === activeFilter) return;
                  onChangeFilter?.(id);
                }}
                style={{
                  padding: "2px 6px",
                  border:
                    id === activeFilter
                      ? "1px solid rgba(255,255,255,0.45)"
                      : "1px solid transparent",
                  borderRadius: "4px",
                  cursor:
                    id === activeFilter
                      ? "default"
                      : "pointer",
                  opacity:
                    id === activeFilter
                      ? 1
                      : 0.82,
                  userSelect: "none",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
