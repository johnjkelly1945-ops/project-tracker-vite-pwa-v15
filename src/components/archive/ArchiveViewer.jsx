// @ts-nocheck
/*
=====================================================================
METRA — ArchiveViewer.jsx
=====================================================================

Stage 364 — Viewer Foundation
Stage 366 — Structural Inspection (Read-Only)

PURPOSE
---------------------------------------------------------------------
Inspect archived segment structure.

• Projection only
• No mutation
• Read-only inspection of summaries and tasks
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

export default function ArchiveViewer({
  segment,
  summaries = [],
  tasks = []
}) {

  if (!segment) {
    return (
      <div style={{ padding: "12px", width: "60%" }}>
        <div style={{ opacity: 0.7 }}>
          Select an archived segment to inspect.
        </div>
      </div>
    );
  }

  const segmentSummaries =
    summaries.filter(s => s.segmentId === segment.segmentId);

  return (
    <div style={{ padding: "12px", width: "60%" }}>

      <div style={{ fontWeight: "700", marginBottom: "10px" }}>
        Archive Viewer
      </div>

      <div style={{ marginBottom: "16px", fontSize: "13px" }}>
        <div><strong>{segment.segmentTitle}</strong></div>
        <div>Segment ID: {segment.segmentId}</div>
        <div>Archived: {segment.archived ? "true" : "false"}</div>
        <div>Archived At: {fmtDateTime(segment.archivedAt)}</div>
        <div>Created At: {fmtDateTime(segment.createdAt)}</div>
      </div>

      <div style={{
        border: "1px solid #ddd",
        borderRadius: "6px",
        padding: "10px",
        background: "#fafafa"
      }}>

        <div style={{ fontWeight: "600", marginBottom: "8px" }}>
          Summaries
        </div>

        {segmentSummaries.length === 0 && (
          <div style={{ opacity: 0.7 }}>No summaries found.</div>
        )}

        {segmentSummaries.map(summary => {

          const summaryTasks =
            tasks.filter(
              t =>
                t.summaryId === summary.id &&
                (t.segmentId ?? segment.segmentId) === segment.segmentId
            );

          return (
            <div key={summary.id} style={{ marginBottom: "12px" }}>

              <div style={{ fontWeight: "600", fontSize: "13px" }}>
                {summary.title}
              </div>

              <div style={{ marginLeft: "12px", marginTop: "4px" }}>

                {summaryTasks.length === 0 && (
                  <div style={{ opacity: 0.7 }}>No tasks</div>
                )}

                {summaryTasks.map(task => (
                  <div key={task.id} style={{ fontSize: "12px" }}>
                    • {task.title}
                  </div>
                ))}

              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
}
