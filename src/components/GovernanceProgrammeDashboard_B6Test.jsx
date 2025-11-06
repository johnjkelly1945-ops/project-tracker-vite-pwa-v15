/* ======================================================================
   METRA – GovernanceProgrammeDashboard.jsx
   Phase 4.6 B.6 – Programme Detail Drill-Down (Integrated Production)
   ----------------------------------------------------------------------
   • Combines verified A.9 summary + B.6 detail drill-down
   • Click metric → slide-in detail panel
   • “← Back to Summary” closes panel
   • Retains FilterBar, live metrics, scroll stability
   • No console warnings (Framer Motion safe)
   ====================================================================== */

import React, { useState, useEffect, useMemo } from "react";
import { motion, LayoutGroup } from "framer-motion";
import FilterBar from "./FilterBar";
import { getGovernanceData } from "../utils/GovernanceDataBridge";
import "./GovernanceProgrammeDashboard.css";

// === Inline safety styles (overlay visibility) ===
const styles = `
html, body, #root { overflow: visible !important; background:#f9fafb; }
.governance-dashboard {
  position: relative;
  overflow: visible !important;
  padding: 1rem;
}
.metrics-bar {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}
.metric-card {
  flex: 1;
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  padding: 1rem;
  cursor: pointer;
  text-align: center;
  transition: box-shadow 0.2s;
}
.metric-card:hover, .metric-card:focus {
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  outline: none;
}
.metric-label { font-size: 0.9rem; color: #334155; }
.metric-value { font-size: 1.8rem; font-weight: 700; }
.detail-panel {
  position: fixed;
  top: 0; right: 0;
  width: 420px; height: 100vh;
  background: #f8fafc;
  box-shadow: -4px 0 20px rgba(0,0,0,0.25);
  z-index: 99999;
  display: flex;
  flex-direction: column;
  border-left: 4px solid #0a2b5c;
}
.detail-header {
  padding: 1rem;
  background: #0a2b5c;
  color: #fff;
  display: flex;
  flex-direction: column;
}
.back-btn {
  display: inline-block;
  background: #ffffff15;
  border: 1px solid #fff;
  padding: 0.4rem 0.75rem;
  border-radius: 0.4rem;
  color: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  width: fit-content;
  transition: background 0.2s, transform 0.2s;
}
.back-btn:hover {
  background: #ffffff30;
  transform: scale(1.05);
}
.detail-content { flex: 1; overflow-y: auto; padding: 1rem; }
.project-list { list-style:none; padding:0; margin:0; }
.project-item {
  display:flex; align-items:center;
  padding:0.5rem 0; border-bottom:1px solid #e5e7eb;
}
.status-dot {
  width:10px; height:10px; border-radius:50%; margin-right:0.5rem;
}
.no-data { color:#64748b; font-style:italic; padding:0.5rem; }
`;

const ensureStyle = () => {
  if (!document.getElementById("b6-inline-style")) {
    const tag = document.createElement("style");
    tag.id = "b6-inline-style";
    tag.innerHTML = styles;
    document.head.appendChild(tag);
  }
};

const getStatusColor = (status) => {
  if (!status) return "#cbd5e1";
  const s = status.toLowerCase();
  if (s.includes("on")) return "#16a34a";
  if (s.includes("risk")) return "#f59e0b";
  if (s.includes("off")) return "#dc2626";
  return "#94a3b8";
};

// === Reusable subcomponents ===
const MetricCard = ({ label, value, color, onClick }) => (
  <motion.div
    className="metric-card"
    tabIndex={0}
    style={{ borderTop: `4px solid ${color}` }}
    whileHover={{ scale: 1.03 }}
    onClick={onClick}
    onKeyDown={(e) => e.key === "Enter" && onClick()}
  >
    <div className="metric-label">{label}</div>
    <div className="metric-value">{value}</div>
  </motion.div>
);

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
      <h2 style={{ marginTop: "0.8rem" }}>{title}</h2>
    </div>
    <div className="detail-content">{children}</div>
  </motion.div>
);

// === Main Dashboard Component ===
export default function GovernanceProgrammeDashboard() {
  const [governanceData, setGovernanceData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState(null);

  useEffect(() => {
    ensureStyle();
    const data = getGovernanceData();
    setGovernanceData(data);
  }, []);

  // --- Compute summary metrics ---
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

  // --- Filtered project list for drill-down ---
  const filteredProjects = useMemo(() => {
    if (!selectedMetric) return [];
    const key = selectedMetric.toLowerCase().replace(/\s/g, "");
    return governanceData.filter((d) =>
      (d.status || "").toLowerCase().includes(key)
    );
  }, [selectedMetric, governanceData]);

  return (
    <div className="governance-dashboard">
      <FilterBar />

      {/* === Summary metric cards === */}
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

      {/* === Slide-in detail panel === */}
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
    </div>
  );
}
