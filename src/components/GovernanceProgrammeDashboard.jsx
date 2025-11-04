/* ======================================================================
   METRA – GovernanceProgrammeDashboard.jsx
   Phase 4.6 A.8 Step 2 – Live Data Integration + Safe Metrics Mapping
   ----------------------------------------------------------------------
   Supports both legacy sampleData (project/items) and live data feed
   (programme/owner/status/projects).
   ====================================================================== */

import React, { useMemo } from "react";
import "../styles/GovernanceProgrammeDashboard.css";

export default function GovernanceProgrammeDashboard({ governanceData }) {
  // Normalise structure between sample and live data
  const data = Array.isArray(governanceData)
    ? governanceData.map((d) => {
        if (d.programme) {
          // Live data format
          return {
            project: d.programme,
            items: (d.projects || []).map((p) => ({
              status: d.status || "Unknown",
              name: p.name,
            })),
          };
        }
        return d; // fallback to existing format
      })
    : [];

  // --- Calculate summary metrics ---
  const metrics = useMemo(() => {
    const totalProjects = data.length;
    let totalActions = 0;
    let overdueCount = 0;
    let onTrackCount = 0;

    data.forEach((p) =>
      p.items.forEach((i) => {
        totalActions++;
        const s = i.status.toLowerCase();
        if (s.includes("red") || s.includes("overdue") || s.includes("escalated"))
          overdueCount++;
        if (s.includes("green") || s.includes("completed") || s.includes("on track"))
          onTrackCount++;
      })
    );

    const onTrackPercent =
      totalActions > 0 ? Math.round((onTrackCount / totalActions) * 100) : 0;

    return { totalProjects, totalActions, overdueCount, onTrackPercent };
  }, [data]);

  const projectRAG = (items) => {
    const statuses = items.map((i) => i.status.toLowerCase());
    if (statuses.some((s) => s.includes("red") || s.includes("overdue") || s.includes("escalated")))
      return "red";
    if (statuses.some((s) => s.includes("amber") || s.includes("pending") || s.includes("in progress")))
      return "amber";
    return "green";
  };

  return (
    <div className="programme-root">
      <header className="programme-header">
        <h1>Programme Roll-Up Dashboard</h1>
        <p className="programme-subtitle">
          Live Governance Feed (Phase 4.6 A.8)
        </p>
      </header>

      <main className="programme-scroll">
        {/* ===== Summary Cards ===== */}
        <section className="programme-summary-grid">
          <div className="summary-card blue">
            <div className="summary-value">{metrics.totalProjects}</div>
            <div className="summary-title">Total Programmes</div>
          </div>
          <div className="summary-card amber">
            <div className="summary-value">{metrics.totalActions}</div>
            <div className="summary-title">Total Projects</div>
          </div>
          <div className="summary-card red">
            <div className="summary-value">{metrics.overdueCount}</div>
            <div className="summary-title">Red / Overdue</div>
          </div>
          <div className="summary-card green">
            <div className="summary-value">{metrics.onTrackPercent}%</div>
            <div className="summary-title">On Track</div>
          </div>
        </section>

        {/* ===== Programme Rows ===== */}
        <section className="programme-projects">
          {data.map((project, idx) => {
            const rag = projectRAG(project.items);
            return (
              <div key={idx} className="project-row">
                <div className="project-header">
                  <span className={`rag-dot ${rag}`}></span>
                  <h2>{project.project}</h2>
                </div>
                <ul className="project-list">
                  {project.items.map((item, i) => (
                    <li key={i}>
                      <span
                        className={`status-tag ${item.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {item.name
                          ? `${item.name} – ${item.status}`
                          : item.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
