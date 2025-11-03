/* ======================================================================
   METRA – GovernanceProgrammeDashboard.jsx
   Phase 4.6 A.7 Step 3 – Live RAG Integration
   ----------------------------------------------------------------------
   Adds dynamic metric computation and animated summary cards.
   Simulates live Governance data refresh every 5 seconds.
   ====================================================================== */

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import "../Styles/GovernanceProgrammeDashboard.css";

/* === Mock Governance Data (temporary until API link) === */
const initialGovernanceData = [
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

export default function GovernanceProgrammeDashboard() {
  const [data, setData] = useState(initialGovernanceData);

  /* === Simulate live updates every 5 s === */
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = prev.map((project) => ({
          ...project,
          items: project.items.map((item) => {
            const statuses = ["Completed", "In Progress", "Pending", "Overdue"];
            return {
              ...item,
              status: statuses[Math.floor(Math.random() * statuses.length)],
            };
          }),
        }));
        return newData;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  /* === Compute Programme Metrics === */
  const metrics = useMemo(() => {
    const totalProjects = data.length;
    let totalActions = 0;
    let overdueCount = 0;
    let onTrackCount = 0;

    data.forEach((project) => {
      project.items.forEach((item) => {
        totalActions++;
        const s = item.status.toLowerCase();
        if (s.includes("overdue") || s.includes("escalated")) overdueCount++;
        if (s.includes("completed") || s.includes("on track")) onTrackCount++;
      });
    });

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
    <div className="programme-dashboard">
      {/* ===== Header ===== */}
      <header className="programme-header">
        <h1>Programme Roll-Up Dashboard</h1>
        <p className="programme-subtitle">
          Live governance metrics with automatic refresh
        </p>
      </header>

      {/* ===== Scrollable Content ===== */}
      <div className="programme-scroll">
        <div className="programme-content">
          {/* ===== Summary Metrics Bar ===== */}
          <section className="programme-summary-grid">
            <motion.div
              className="summary-card blue"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="summary-value">{metrics.totalProjects}</div>
              <div className="summary-title">Total Projects</div>
            </motion.div>

            <motion.div
              className="summary-card amber"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="summary-value">{metrics.totalActions}</div>
              <div className="summary-title">Total Actions</div>
            </motion.div>

            <motion.div
              className="summary-card red"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="summary-value">{metrics.overdueCount}</div>
              <div className="summary-title">Overdue</div>
            </motion.div>

            <motion.div
              className="summary-card green"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="summary-value">
                {metrics.onTrackPercent}%
              </div>
              <div className="summary-title">On Track</div>
            </motion.div>
          </section>

          {/* ===== Project List ===== */}
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
        </div>
      </div>
    </div>
  );
}
