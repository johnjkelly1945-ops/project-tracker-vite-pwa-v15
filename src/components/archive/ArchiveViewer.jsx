import { useState } from "react";
// @ts-nocheck
/*
=====================================================================
METRA — ArchiveViewer.jsx
=====================================================================

Stage 364 — Viewer Foundation
Stage 366 — Structural Inspection (Read-Only)
Stage 367 — Dual-Pane Archive Mirror
Stage 368 — Archived Task Inspection + Archive Search

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
import TaskPopup from "../TaskPopup";

function fmtDateTime(ts) {
  if (!ts) return "—";
  try {
    return new Date(ts).toISOString().replace("T", " ").slice(0, 19);
  } catch {
    return "—";
  }
}

function PaneRenderer({ discipline, segment, summaries, tasks, onTaskSelect, searchTerm }) {

  const paneSummaries =
    summaries.filter(
      s =>
        (s.segmentId ?? segment.segmentId) === segment.segmentId &&
        (s.discipline ?? discipline) === discipline
    );

  const paneTasks =
    tasks.filter(t => {
      const matchesSegment =
        ((t.segmentId ?? segment.segmentId) === segment.segmentId);

      const matchesDiscipline =
        ((t.discipline ?? discipline) === discipline);

      const matchesSearch =
        !searchTerm ||
        searchTerm.length < 2 ||
        (t.title &&
         t.title.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesSegment && matchesDiscipline && matchesSearch;
    });

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
                  • <span
                      style={{ cursor: "pointer" }}
                      onClick={() => onTaskSelect(task)}
                    >
                      {task.title}
                    </span>
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
            • <span
                style={{ cursor: "pointer" }}
                onClick={() => onTaskSelect(task)}
              >
                {task.title}
              </span>
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

  const [selectedArchivedTask, setSelectedArchivedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

      <div style={{ padding: "0 12px 12px" }}>
        <input
          type="text"
          placeholder="Search archived tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", padding: "6px" }}
        />
      </div>

      <div style={{ padding: "0 12px 12px", fontSize: "13px" }}>
        <div><strong>{segment.segmentTitle}</strong></div>
        <div>Segment ID: {segment.segmentId}</div>
        <div>Archived: {segment.archived ? "true" : "false"}</div>
        <div>Archived At: {fmtDateTime(segment.archivedAt)}</div>
        <div>Created At: {fmtDateTime(segment.createdAt)}</div>
      </div>

      <div style={{ flex: 1, height: "calc(100% - 140px)" }}>

        <DualPane
          mode="dual"
          managementBody={
            <PaneRenderer
              discipline="management"
              segment={segment}
              summaries={summaries}
              tasks={tasks}
              onTaskSelect={setSelectedArchivedTask}
              searchTerm={searchTerm}
            />
          }
          developmentBody={
            <PaneRenderer
              discipline="development"
              segment={segment}
              summaries={summaries}
              tasks={tasks}
              onTaskSelect={setSelectedArchivedTask}
              searchTerm={searchTerm}
            />
          }
        />

      </div>

      {selectedArchivedTask && (
        <TaskPopup
          task={selectedArchivedTask}
          summaries={summaries}
          readOnly={true}
          onClose={() => setSelectedArchivedTask(null)}
        />
      )}

    </div>
  );
}
