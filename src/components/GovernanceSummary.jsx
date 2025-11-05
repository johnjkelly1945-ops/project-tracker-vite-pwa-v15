/* ======================================================================
   METRA – GovernanceSummary.jsx
   Phase 4.6 B Step 1 – Governance Summary Linkage Init
   ----------------------------------------------------------------------
   • Builds on Phase 4.6 A.9 Step 4B (Animated Metrics Refresh Verified)
   • Adds click-to-drill-down linkage between metrics and programme cards
   • Maintains fade + slide animation from previous phase
   • Highlights active metric; toggles back to full view on second click
   ====================================================================== */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getGovernanceMetrics } from "../utils/GovernanceDataBridge";
import "../styles/GovernanceSummary.css";

const GovernanceSummary = ({ filters, onMetricSelect }) => {
  // Metrics state
  const [metrics, setMetrics] = useState({
    totalProjects: 0,
    totalActions: 0,
    onTrackPercent: 0,
  });

  // Active metric tracking for highlight + drill-down toggle
  const [activeMetric, setActiveMetric] = useState(null);

  // Key to trigger animation refresh
  const [refreshKey, setRefreshKey] = useState(0);

  // === Update metrics when filters change ===
  useEffect(() => {
    const data = getGovernanceMetrics(filters);
    setMetrics(data);
    setRefreshKey((prev) => prev + 1);
    setActiveMetric(null); // reset highlight on filter change
  }, [filters]);

  // === Handle metric click ===
  const handleMetricClick = (metricKey) => {
    // Toggle behaviour: deselect if same metric clicked again
    const newActive = activeMetric === metricKey ? null : metricKey;
    setActiveMetric(newActive);
    if (onMetricSelect) {
      onMetricSelect(newActive); // notify parent dashboard
    }
  };

  // === Framer Motion fade / slide variants ===
  const fadeSlide = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.3, ease: "easeOut" },
  };

  // === Conditional class for active metric highlight ===
  const getClass = (key) =>
    `metric-item ${activeMetric === key ? "metric-active" : ""}`;

  return (
    <div className="governance-summary">
      <div className="metrics-bar">
        <AnimatePresence mode="wait">
          <motion.div
            key={refreshKey}
            className="metrics-inner"
            {...fadeSlide}
          >
            <span
              className={getClass("projects")}
              onClick={() => handleMetricClick("projects")}
            >
              <strong>Total Projects:</strong> {metrics.totalProjects}
            </span>

            <span
              className={getClass("actions")}
              onClick={() => handleMetricClick("actions")}
            >
              <strong>Total Actions:</strong> {metrics.totalActions}
            </span>

            <span
              className={getClass("onTrack")}
              onClick={() => handleMetricClick("onTrack")}
            >
              <strong>% On Track:</strong> {metrics.onTrackPercent}%
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GovernanceSummary;
