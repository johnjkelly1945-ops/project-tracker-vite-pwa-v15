/* ======================================================================
   METRA – ProgrammeRollupDashboard.jsx
   Phase 4.6 B Step 1 – Governance Summary Linkage Integration
   ----------------------------------------------------------------------
   • Connects GovernanceSummary metric clicks to programme card filters.
   • Receives onMetricSelect callback from GovernanceSummary.
   • Filters visible programme cards accordingly.
   • Maintains layout, filter bar, and animation stability.
   ====================================================================== */

import React, { useState, useEffect } from "react";
import GovernanceSummary from "./GovernanceSummary";
import { getProgrammeData } from "../utils/GovernanceDataBridge";
import "../styles/GovernanceSummary.css";

const ProgrammeRollupDashboard = () => {
  // === Dashboard state ===
  const [filters, setFilters] = useState({
    role: "All",
    status: "All",
    period: "Current",
  });

  const [programmeData, setProgrammeData] = useState([]);
  const [displayData, setDisplayData] = useState([]); // what is currently shown
  const [activeMetric, setActiveMetric] = useState(null);

  // === Load or refresh base data ===
  useEffect(() => {
    const data = getProgrammeData(filters);
    setProgrammeData(data);
    setDisplayData(data);
    setActiveMetric(null);
  }, [filters]);

  // === Handle metric selection from GovernanceSummary ===
  const handleMetricSelect = (metricKey) => {
    setActiveMetric(metricKey);

    if (!metricKey) {
      // If deselected, show all
      setDisplayData(programmeData);
      return;
    }

    let filtered = programmeData;

    switch (metricKey) {
      case "projects":
        // Example: show all programmes (no change in structure)
        filtered = programmeData;
        break;
      case "actions":
        // Example: filter programmes with >0 actions
        filtered = programmeData.filter((p) => p.totalActions > 0);
        break;
      case "onTrack":
        // Example: filter by on-track status
        filtered = programmeData.filter(
          (p) => p.status && p.status.toLowerCase() === "green"
        );
        break;
      default:
        filtered = programmeData;
    }

    setDisplayData(filtered);
  };

  return (
    <div className="programme-rollup-dashboard">
      {/* === Filter Bar (already existing component) === */}
      {/* Assume FilterBar modifies filters via setFilters */}
      {/* <FilterBar filters={filters} setFilters={setFilters} /> */}

      {/* === Governance Summary with linkage callback === */}
      <GovernanceSummary filters={filters} onMetricSelect={handleMetricSelect} />

      {/* === Programme Cards === */}
      <div className="programme-cards">
        {displayData.length === 0 ? (
          <p style={{ color: "#666", padding: "1rem" }}>No records found.</p>
        ) : (
          displayData.map((prog) => (
            <div key={prog.id} className="programme-card">
              <h3>{prog.name}</h3>
              <p>Status: {prog.status}</p>
              <p>Actions: {prog.totalActions}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProgrammeRollupDashboard;
