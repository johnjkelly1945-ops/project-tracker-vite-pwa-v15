/* ======================================================================
   METRA – GovernanceProgrammeDashboard.jsx
   Phase 4.6 A.7 Step 2F – Scroll-Guaranteed Layout (Safari Confirmed)
   ====================================================================== */

import React, { useMemo } from "react";
import "../styles/GovernanceProgrammeDashboard.css";

const GovernanceProgrammeDashboard = ({ governanceData }) => {
  const sampleData = [
    {
      project: "Project Orion",
      items: [
        { status: "Pending" },
        { status: "Completed" },
        { status: "In Progress" },
      ],
    },
    {
      project: "Project Atlas",
      items: [
        { status: "Overdue" },
        { status: "Completed" },
        { status: "Completed" },
      ],
    },
    {
      project: "Project Nova",
      items: [{ status: "Completed" }, { status: "Completed" }],
    },
  ];

  const data = governanceData || sampleData;

  const metrics = useMemo(() => {
    const totalProjects = data.length;
    let totalActions = 0;
    let overdueCount = 0;
    let onTrackCount = 0;

    data.forEach((p) =>
      p.items.forEach((i) => {
        totalActions++;
        const s = i.status.toLowerCase();
        if (s.includes("overdue") || s.includes("escalated")) overdueCount++;
        if (s.includes("completed") || s.includes("on track")) onTrackCount++;
      })
    );

    const onTrackPercent =
      totalActions > 0 ? Math.round((onTrackCount / totalActions) * 100) : 0;

    return { totalProjects, totalActions, overdueCount, onTrackPercent };
  }, [data]);

  const projectRAG = (items) => {
    const statuses = items.map((i) => i.status.toLowerCase());
    if (statuses.some((s) => s.includes("overdue") || s.includes("escalated")))
      return "red";
    if (statuses.some((s) => s.includes("pending") || s.includes("in progress")))
      return "amber";
    return "green";
  };

  return (
    <div className="programme-root">
      <header className="programme-header">
        <h1>Programme Roll-Up Dashboard</h1>
        <p className="programme-subtitle">
          Aggregated metrics from all governance projects
        </p>
      </header>

      {/* Scrollable content container */}
      <main className="programme-scroll">
        <section className="programme-summary-grid">
          <div className="summary-card blue">
            <div className="summary-value">{metrics.totalProjects}</div>
            <div className="summary-title">Total Projects</div>
          </div>
          <div className="summary-card amber">
            <div className="summary-value">{metrics.totalActions}</div>
            <div className="summary-title">Total Actions</div>
          </div>
          <div className="summary-card red">
            <div className="summary-value">{metrics.overdueCount}</div>
            <div className="summary-title">Overdue</div>
          </div>
          <div className="summary-card green">
            <div className="summary-value">{metrics.onTrackPercent}%</div>
            <div className="summary-title">On Track</div>
          </div>
        </section>

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
                        {item.status}
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
};

export default GovernanceProgrammeDashboard;
