/* ======================================================================
   METRA – GovernanceProgrammeDashboard.jsx
   Phase 4.6 B.7 – Drill-Down Layout Reintegration
   ----------------------------------------------------------------------
   • Restores full Programme Roll-Up layout (blue header, FilterBar)
   • Integrates verified B6 drill-down logic and animations
   • Uses existing GovernanceProgrammeDashboard.css for styling
   • Data source: getGovernanceData() – live programme feed
   • Motion safe (AnimatePresence mode="sync")
   ====================================================================== */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import FilterBar from "./FilterBar";
import { getGovernanceData } from "../utils/GovernanceDataBridge";
import "./GovernanceProgrammeDashboard.css";

// === Colour Helper (RAG) ===
const getStatusColor = (status) => {
  if (!status) return "#cbd5e1";
  const s = status.toLowerCase();
  if (s.includes("on")) return "#16a34a";
  if (s.includes("risk")) return "#f59e0b";
  if (s.includes("off")) return "#dc2626";
  return "#94a3b8";
};

// === Metric Card Component ===
const MetricCard = ({ label, value, color, onClick }) => (
  <motion.div
    className="metric-card"
    style={{ borderTop: `4px solid ${color}` }}
    whileHover={{ scale: 1.03 }}
    onClick={onClick}
  >
    <div className="metric-label">{label}</div>
    <div className="metric-value">{value}</div>
  </motion.div>
);

// === Detail Panel (Slide-In) ===
const DetailPanel = ({ title, onClose, children }) => (
  <motion.div
    className="detail-panel"
    initial={{ x: "100%" }}
    animate={{ x: 0 }}
    exit={{ x: "100%" }}
    transition={{ type: "tween", duration: 0.4 }}
  >
    <div className="detail-header">
      <button className="back-btn" onClick={onClose}>
        ← Back to Summary
      </button>
      <h2>{title}</h2>
    </div>
    <div className="detail-content">{children}</div>
  </motion.div>
);

// === Main Dashboard Component ===
const GovernanceProgrammeDashboard = () => {
  const [governanceData, setGovernanceData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState(null);

  useEffect(() => {
    const data = getGovernanceData();
    setGovernanceData(data);
    console.log("✅ Phase 4.6 B.7 – Layout Reintegration Active");
  }, []);

  // === Compute counts for summary metrics ===
  const metrics = useMemo(() => {
    const counts = { on: 0, risk: 0, off: 0 };
    governanceData.forEach((item) => {
      const s = item.status?.toLowerCase() || "";
      if (s.includes("ontrack")) counts.on++;
      else if (s.includes("atrisk")) counts.risk++;
      else if (s.includes("offtrack")) counts.off++;
    });
    return [
      { label: "On Track", value: counts.on, color: getStatusColor("on") },
      { label: "At Risk", value: counts.risk, color: getStatusColor("risk") },
      { label: "Off Track", value: counts.off, color: getStatusColor("off") },
    ];
  }, [governanceData]);

  // === Filtered list for drill-down ===
  const filteredProjects = useMemo(() => {
    if (!selectedMetric) return [];
    const key = selectedMetric.toLowerCase().replace(/\s/g, "");
    return governanceData.filter((d) =>
      (d.status || "").toLowerCase().includes(key)
    );
  }, [selectedMetric, governanceData]);

  return (
    <div className="governance-dashboard">
      {/* ===== Header ===== */}
      <header className="module-header-box">
        <h1>Programme Roll-Up Dashboard</h1>
        <p className="subheader">
          Live Governance Overview • Phase 4.6 B.7 – Drill-Down Reintegration
        </p>
      </header>

      {/* ===== Filter Bar ===== */}
      <FilterBar />

      {/* ===== Summary Metric Bar ===== */}
      <LayoutGroup>
        <motion.div
          className="metrics-bar"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {metrics.map((m) => (
            <MetricCard
              key={m.label}
              label={m.label}
              value={m.value}
              color={m.color}
              onClick={() => setSelectedMetric(m.label)}
            />
          ))}
        </motion.div>
      </LayoutGroup>

      {/* ===== Detail Drill-Down Panel ===== */}
      <AnimatePresence mode="sync">
        {selectedMetric && (
          <DetailPanel
            key="detail"
            title={`${selectedMetric} Projects`}
            onClose={() => setSelectedMetric(null)}
          >
            {filteredProjects.length === 0 ? (
              <p className="no-data">No projects found for this category.</p>
            ) : (
              <ul className="project-list">
                {filteredProjects.map((p, idx) => (
                  <li key={idx} className="project-item">
                    <span
                      className="status-dot"
                      style={{ backgroundColor: getStatusColor(p.status) }}
                    ></span>
                    <span className="project-title">{p.projectName}</span>
                  </li>
                ))}
              </ul>
            )}
          </DetailPanel>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GovernanceProgrammeDashboard;
