/* ======================================================================
   METRA – GovernanceProgrammeDashboard.jsx
   Phase 4.6 B.5 Step B – Animated Metric Feedback
   ----------------------------------------------------------------------
   Adds bounce + glow animation on metric click (Safari-safe).
   Keeps stable scroll and verified click logic from Step A.
   ====================================================================== */

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import FilterBar from "./FilterBar";
import { getGovernanceData } from "../utils/GovernanceDataBridge";
import "./GovernanceProgrammeDashboard.css";

// === RAG Colour Helper ===
const getStatusColor = (status) => {
  if (!status) return "#cbd5e1";
  const s = status.toLowerCase();
  if (s.includes("on")) return "#16a34a";
  if (s.includes("risk")) return "#f59e0b";
  if (s.includes("off")) return "#dc2626";
  return "#94a3b8";
};

const GovernanceProgrammeDashboard = () => {
  const [programmes, setProgrammes] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");
  const [clickedMetric, setClickedMetric] = useState(null);

  useEffect(() => {
    const data = getGovernanceData();
    console.log("GovernanceDataBridge → loaded", data.length, "programme records");
    setProgrammes(data);
  }, []);

  const filteredProgrammes = useMemo(() => {
    return programmes.filter((p) => {
      const matchRole = roleFilter ? p.owner === roleFilter : true;
      const matchStatus = statusFilter ? p.status === statusFilter : true;
      const matchPeriod = periodFilter ? p.period === periodFilter : true;
      return matchRole && matchStatus && matchPeriod;
    });
  }, [programmes, roleFilter, statusFilter, periodFilter]);

  // === Basic Summary Metrics ===
  const totalProjects = filteredProgrammes.length;
  const totalActions = filteredProgrammes.reduce((sum, p) => sum + (p.actions || 0), 0);
  const onTrack = filteredProgrammes.filter(
    (p) => p.status && p.status.toLowerCase().includes("on")
  ).length;
  const onTrackPercent = totalProjects > 0 ? Math.round((onTrack / totalProjects) * 100) : 0;

  // === Metric Click Handler ===
  const handleMetricClick = (label) => {
    console.log("🟢 Metric clicked:", label);
    setClickedMetric(label);
    setTimeout(() => setClickedMetric(null), 400); // reset highlight
  };

  return (
    <div className="governance-dashboard">
      {/* ===== Header + Filter Section ===== */}
      <div className="dashboard-header-wrapper">
        <h2 className="dashboard-header">Programme Roll-Up Dashboard · Live Governance Feed</h2>
        <FilterBar
          onRoleChange={setRoleFilter}
          onStatusChange={setStatusFilter}
          onPeriodChange={setPeriodFilter}
        />

        {/* ===== Summary Metrics Bar ===== */}
        <div className="dashboard-summary-bar">
          {[
            { label: "Total Projects", value: totalProjects },
            { label: "Total Actions", value: totalActions },
            { label: "% On Track", value: `${onTrackPercent}%` },
          ].map((metric) => (
            <motion.div
              key={metric.label}
              className={`summary-item ${
                clickedMetric === metric.label ? "active" : ""
              }`}
              onClick={() => handleMetricClick(metric.label)}
              animate={{
                scale: clickedMetric === metric.label ? 1.15 : 1,
                boxShadow:
                  clickedMetric === metric.label
                    ? "0 0 16px rgba(21,101,192,0.6)"
                    : "0 0 0 rgba(0,0,0,0)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <span className="summary-label">{metric.label}:</span>
              <span className="summary-value">{metric.value}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ===== Scrollable Content ===== */}
      <motion.div className="dashboard-scroll-area" layoutScroll>
        <LayoutGroup>
          <motion.div layout="position" className="programme-card-grid">
            <AnimatePresence mode="wait">
              {filteredProgrammes.length > 0 ? (
                filteredProgrammes.map((p) => (
                  <motion.div
                    key={p.id}
                    className="programme-card"
                    layout="position"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    style={{
                      borderLeft: `6px solid ${getStatusColor(p.status)}`,
                      transformOrigin: "top center",
                      willChange: "transform, opacity",
                    }}
                  >
                    <h3>{p.name}</h3>
                    <p><strong>Status:</strong> {p.status}</p>
                    <p><strong>Actions:</strong> {p.actions}</p>
                    <p><strong>Owner:</strong> {p.owner}</p>
                    <p><strong>Period:</strong> {p.period}</p>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  key="noresults"
                  className="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  No programmes match current filters.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </motion.div>
    </div>
  );
};

export default GovernanceProgrammeDashboard;
