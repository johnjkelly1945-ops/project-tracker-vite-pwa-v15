// @ts-nocheck
/*
=====================================================================
METRA — ArchiveViewer.jsx
=====================================================================

Stage 364 — Viewer Foundation
Stage 366 — Structural Inspection (Read-Only)
Stage 367 — Dual-Pane Archive Mirror

PURPOSE
---------------------------------------------------------------------
Inspect archived segment structure.

• Projection only
• No mutation
• Mirrors workspace dual-pane structure
• Read-only inspection of summaries and tasks
=====================================================================
*/

import DualPane from "../DualPane";

function fmtDateTime(ts) {
  if (!ts) return "—";
  try {
    return new Date(ts).toISOString().replace("T", " ").slice(0, 19);
  } catch {
    return "—";
  }
}

function PaneRenderer({ discipline, segment, summaries, tasks }) {

  const paneSummaries =
    summaries.filter(
      s =>
        (s.segmentId ?? segment.segmentId) === segment.segmentId &&
        (s.discipline ?? discipline) === discipline
    );

  const paneTasks =
    tasks.filter(
      t =>
        ((t.segmentId ?? segment.segmentId) === segment.segmentId) &&
        (t.discipline ?? discipline) === discipline
    );

  return (
    <div>

      {paneSummaries.map(summary => {

        const summaryTasks =
          paneTasks.filter(t => t.summaryId === summary.id);

        return (
          <div key={summary.id} style={{ marginBottom: "12px" }}>

            <div style={{ fontWeight: "600", fontSize: "13px" }}>
              {summary.title}
            </div>

            <div style={{ marginLeft: "12px", marginTop: "4px" }}>

              {summaryTasks.map(task => (
                <div key={task.id} style={{ fontSize: "12px" }}>
                  • {task.title}
                </div>
              ))}

            </div>
          </div>
        );
      })}

      {paneTasks
        .filter(t => !t.summaryId)
        .map(task => (
          <div key={task.id} style={{ fontSize: "12px" }}>
            • {task.title}
          </div>
        ))}

    </div>
  );
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

  return (
    <div style={{ width: "60%", height: "100%" }}>

      <div style={{ padding: "12px", fontWeight: "700" }}>
        Archive Viewer
      </div>

      <div style={{ padding: "0 12px 12px", fontSize: "13px" }}>
        <div><strong>{segment.segmentTitle}</strong></div>
        <div>Segment ID: {segment.segmentId}</div>
        <div>Archived: {segment.archived ? "true" : "false"}</div>
        <div>Archived At: {fmtDateTime(segment.archivedAt)}</div>
        <div>Created At: {fmtDateTime(segment.createdAt)}</div>
      </div>

      <div style={{ flex: 1, height: "calc(100% - 110px)" }}>

        <DualPane
          mode="dual"
          managementBody={
            <PaneRenderer
              discipline="management"
              segment={segment}
              summaries={summaries}
              tasks={tasks}
            />
          }
          developmentBody={
            <PaneRenderer
              discipline="development"
              segment={segment}
              summaries={summaries}
              tasks={tasks}
            />
          }
        />

      </div>

    </div>
  );
}
