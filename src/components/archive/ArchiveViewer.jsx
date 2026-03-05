// @ts-nocheck
/*
=====================================================================
METRA — ArchiveViewer.jsx
=====================================================================

Stage 364 — Archive Surface

PURPOSE
---------------------------------------------------------------------
Read-only inspection surface for a selected archived segment.

• Inspection only
• No mutation
• No lifecycle transitions
=====================================================================
*/

function fmtDateTime(ts) {
  if (!ts) return "—";
  try {
    return new Date(ts).toISOString().replace("T", " ").slice(0, 19);
  } catch {
    return "—";
  }
}

export default function ArchiveViewer({ segment = null }) {
  return (
    <div style={{ width: "60%", padding: "12px" }}>
      <div style={{ fontWeight: "700", marginBottom: "10px" }}>
        Archive Viewer
      </div>

      {!segment && (
        <div style={{ opacity: 0.7, fontSize: "13px" }}>
          Select an archived segment to inspect.
        </div>
      )}

      {segment && (
        <>
          <div style={{ fontSize: "14px", fontWeight: "700", marginBottom: "8px" }}>
            {segment.segmentTitle}
          </div>

          <div style={{ fontSize: "13px", marginBottom: "10px" }}>
            <div><strong>Segment ID:</strong> {segment.segmentId}</div>
            <div><strong>Archived:</strong> {segment.archived ? "true" : "false"}</div>
            <div><strong>Archived At:</strong> {fmtDateTime(segment.archivedAt)}</div>
            <div><strong>Created At:</strong> {fmtDateTime(segment.createdAt)}</div>
          </div>

          <div
            style={{
              border: "1px dashed #ccc",
              borderRadius: "8px",
              padding: "10px",
              fontSize: "13px",
              opacity: 0.85,
            }}
          >
            Viewer foundation only (Stage 364).
            <br />
            Structural inspection of bundles → summaries → tasks and governance artefacts
            will be introduced in later stages without enabling mutation.
          </div>
        </>
      )}
    </div>
  );
}
