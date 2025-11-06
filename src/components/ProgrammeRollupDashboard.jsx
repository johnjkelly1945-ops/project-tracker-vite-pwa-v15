/* ======================================================================
   METRA – ProgrammeRollupDashboard.jsx
   Phase 4.6 B.3 Diagnostic Build – Overlay Detection
   ----------------------------------------------------------------------
   • Adds console log listing all full-screen DIV elements to locate
     overlay blocking clicks on metrics bar.
   • Safe for temporary use — does not alter layout or behaviour.
   ====================================================================== */

import React, { useState, useEffect } from "react";
import GovernanceSummary from "./GovernanceSummary";
import {
  getProgrammeData,
  getGovernanceMetrics,
} from "../utils/GovernanceDataBridge";
import "../styles/GovernanceSummary.css";

const ProgrammeRollupDashboard = () => {
  // === Global filters ===
  const [filters, setFilters] = useState({
    role: "All",
    status: "All",
    period: "All",
  });

  // === Data & metrics states ===
  const [programmeData, setProgrammeData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [activeMetric, setActiveMetric] = useState(null);

  // === Mount confirmation ===
  useEffect(() => {
    console.log("✅ ProgrammeRollupDashboard mounted");
  }, []);

  // === Load data & metrics when filters change ===
  useEffect(() => {
    const data = getProgrammeData(filters);
    setProgrammeData(data);
    setDisplayData(data);

    const calculatedMetrics = getGovernanceMetrics(filters);
    setMetrics(calculatedMetrics);

    setActiveMetric(null);
  }, [filters]);

  // === Handle metric click (drill-down) ===
  const handleMetricSelect = (metricKey) => {
    console.log("Metric clicked:", metricKey);
    const newActive = activeMetric === metricKey ? null : metricKey;
    setActiveMetric(newActive);

    let filtered = programmeData;

    switch (newActive) {
      case "projects":
        filtered = programmeData;
        break;
      case "actions":
        filtered = programmeData.filter((p)
