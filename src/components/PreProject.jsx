/* ======================================================================
   METRA – PreProject.jsx
   v9 – Compact Layout + Summary Expand/Collapse (Stable)
   ----------------------------------------------------------------------
   ✔ Summary expand/collapse (mgmt + dev)
   ✔ Tasks grouped under summaries, indented
   ✔ Unassigned tasks follow global chronology
   ✔ Popup opens with openPopup(task, pane)
   ✔ Task row = dot → title → flag only
   ✔ No assign icon, no micro-popup
   ====================================================================== */

import React from "react";
import "../Styles/PreProject.css";

export default function PreProject({
  pane,
  filter,
  tasks,
  summaries,
  setSummaries,
  openPopup,
  onRequestAssign
}) {
  /* -----------------------------------------------------------
     LOCAL STORAGE KEY FOR SUMMARIES (pane-aware)
     ----------------------------------------------------------- */
  const LS_KEY =
    pane === "mgmt" ? "mgmtSummaries_v1" : "devSummaries_v1";

  /* -----------------------------------------------------------
     TOGGLE SUMMARY EXPANDED / COLLAPSED
     ----------------------------------------------------------- */
  const toggleSummary = (summary) => {
    const updated = summaries.map((s) =>
      s.id === summary.id ? { ...s, expanded: !s.expanded } : s
    );

    setSummaries(updated);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
  };

  /* -----------------------------------------------------------
     GROUP TASKS: by summary OR unassigned
     ----------------------------------------------------------- */
  const tasksBySummary = {};
  summaries.forEach((s) => (tasksBySummary[s.id] = []));

  const unassignedTasks = [];

  tasks.forEach((t) => {
    if (t.summaryId && tasksBySummary[t.summaryId]) {
      tasksBySummary[t.summaryId].push(t);
    } else {
      unassignedTasks.push(t);
    }
  });

  /* -----------------------------------------------------------
     FILTER LOGIC (unchanged)
     ----------------------------------------------------------- */
  const applyFilter = (list) => {
    switch (filter) {
      case "notstarted":
        return list.filter(
          (t) => t.status === "Not Started" && !t.flag
        );
      case "inprogress":
        return list.filter((t) => t.status === "In Progress");
      case "completed":
        return list.filter((t) => t.status === "Completed");
      case "flagged":
        return list.filter((t) => t.flag === "red");
      case "open":
        return list.filter((t) => t.updatedForPM);
      default:
        return list;
    }
  };

  /* -----------------------------------------------------------
     RENDER
     ----------------------------------------------------------- */
  return (
    <div className="preproject-list">

      {/* =======================================================
          SUMMARIES + THEIR TASKS
          ======================================================= */}
      {summaries
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((s) => (
          <div key={s.id} className="pp-summary-block">
            
            {/* SUMMARY ROW */}
            <div className="pp-summary-row" onClick={() => toggleSummary(s)}>
              <div className="pp-summary-left">
                <div className="pp-summary-dot"></div>
                <div className="pp-summary-title">{s.title}</div>
              </div>
              <div className="pp-summary-chevron">
                {s.expanded ? "▾" : "▸"}
              </div>
            </div>

            {/* TASKS WITHIN SUMMARY */}
            {s.expanded &&
              applyFilter(
                tasksBySummary[s.id].sort(
                  (a, b) => a.orderIndex - b.orderIndex
                )
              ).map((t) => (
                <div
                  key={t.id}
                  className="pp-task-item"
                  onClick={() => openPopup(t, pane)}
                >
                  {/* STATUS DOT */}
                  <div
                    className={
                      "pp-status-dot " +
                      (t.status === "Completed"
                        ? "status-green"
                        : t.status === "In Progress"
                        ? "status-amber"
                        : "status-grey")
                    }
                  ></div>

                  {/* TITLE */}
                  <div className="pp-task-title">{t.title}</div>

                  {/* FLAG */}
                  {t.flag === "red" && (
                    <div className="pp-flag-dot">⚑</div>
                  )}
                </div>
              ))}
          </div>
        ))}

      {/* =======================================================
          UNASSIGNED TASKS (not under summaries)
          ======================================================= */}
      {applyFilter(
        unassignedTasks.sort((a, b) => a.orderIndex - b.orderIndex)
      ).map((t) => (
        <div
          key={t.id}
          className="pp-task-item"
          onClick={() => openPopup(t, pane)}
        >
          <div
            className={
              "pp-status-dot " +
              (t.status === "Completed"
                ? "status-green"
                : t.status === "In Progress"
                ? "status-amber"
                : "status-grey")
            }
          ></div>

          <div className="pp-task-title">{t.title}</div>

          {t.flag === "red" && <div className="pp-flag-dot">⚑</div>}
        </div>
      ))}
    </div>
  );
}
