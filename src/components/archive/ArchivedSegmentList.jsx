// @ts-nocheck
/*
=====================================================================
METRA — ArchivedSegmentList.jsx
=====================================================================

Stage 364 — Archive Surface
Stage 366 — Discovery Refinement

PURPOSE
---------------------------------------------------------------------
Render a read-only list of archived segments.

• Projection-only
• Selection for inspection only
• No mutation
• Display most recent archived segments (max 10)
=====================================================================
*/

function fmtDate(ts) {
  if (!ts) return "—";
  try {
    return new Date(ts).toISOString().slice(0, 10);
  } catch {
    return "—";
  }
}

export default function ArchivedSegmentList({
  archivedSegments = [],
  selectedSegmentId = null,
  onSelect = () => {},
  onInspect = () => {},
  canInspect = false,
}) {

  const recentSegments = archivedSegments
    .slice()
    .sort((a,b) => (b.archivedAt || 0) - (a.archivedAt || 0))
    .slice(0,10);

  return (
    <div style={{ width: "40%", borderRight: "1px solid #ddd", padding: "12px" }}>
      <div style={{ fontWeight: "700", marginBottom: "10px" }}>
        Archived Segments
      </div>

      {recentSegments.length === 0 && (
        <div style={{ opacity: 0.7, fontSize: "13px" }}>
          No archived segments found.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {recentSegments.map((s) => {
          const isSelected = s.segmentId === selectedSegmentId;
          const line = `${s.segmentType || "SEGMENT"} — ${s.segmentTitle}`;

          return (
            <div
              key={s.segmentId}
              style={{
                display: "grid",
                gridTemplateColumns: "90px 1fr auto",
                gap: "8px",
                alignItems: "center",
                padding: "8px 10px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                background: isSelected ? "#eef3ff" : "#fff",
                fontSize: "13px",
                lineHeight: 1.25,
              }}
              title={line}
            >
              <span style={{ fontWeight: "700", opacity: 0.75 }}>
                {s.segmentType || "SEGMENT"}
              </span>

              <button
                type="button"
                onClick={() => onSelect(s.segmentId)}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  textAlign: "left",
                  cursor: "pointer",
                  font: "inherit",
                }}
              >
                {s.segmentTitle}
              </button>

              {canInspect && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onInspect(s.segmentId);
                  }}
                  style={{
                    border: "1px solid #ddd",
                    background: "#fff",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Inspect
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
