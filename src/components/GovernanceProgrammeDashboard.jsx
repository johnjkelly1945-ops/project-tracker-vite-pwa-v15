/* ======================================================================
   METRA – GovernanceProgrammeDashboard.jsx
   Phase 4.6 A.8 Step 3 – Stage 2 (Prop Flow & Live Filtering)
   ----------------------------------------------------------------------
   Receives filter values from FilterBar and filters programme dataset
   accordingly. Maintains layout and scroll stability.
   ====================================================================== */

import React, { useEffect, useState, useMemo } from "react";
import FilterBar from "./FilterBar";
import { getGovernanceData } from "../utils/GovernanceDataBridge";
import "../Styles/GovernanceProgrammeDashboard.css";

const GovernanceProgrammeDashboard = () => {
  const [programmes, setProgrammes] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");

  // === Load baseline dataset ===
  useEffect(() => {
    const data = getGovernanceData();
    console.log("GovernanceDataBridge → loaded", data.length, "programme records");
    setProgrammes(data);
  }, []);

  // === Memoised filtered dataset ===
  const filteredProgrammes = useMemo(() => {
    return programmes.filter((p) => {
      const matchRole = roleFilter ? p.owner === roleFilter : true;
      const matchStatus = statusFilter ? p.status === statusFilter : true;
      const matchPeriod = periodFilter ? p.period === periodFilter : true;
      return matchRole && matchStatus && matchPeriod;
    });
  }, [programmes, roleFilter, statusFilter, periodFilter]);

  // === Debug output ===
  useEffect(() => {
    console.log(
      `Active Filters → Role: ${roleFilter || "All"}, Status: ${statusFilter || "All"}, Period: ${periodFilter || "All"}`
    );
    console.log("Visible records:", filteredProgrammes.length);
  }, [roleFilter, statusFilter, periodFilter, filteredProgrammes.length]);

  return (
    <div className="governance-dashboard">
      <h2 className="dashboard-header">
        Programme Roll-Up Dashboard · Live Governance Feed (Phase 4.6 A.8)
      </h2>

      {/* === FILTER BAR === */}
      <FilterBar
        onRoleChange={setRoleFilter}
        onStatusChange={setStatusFilter}
        onPeriodChange={setPeriodFilter}
      />

      {/* === PROGRAMME CARDS === */}
      <div className="programme-card-grid">
        {filteredProgrammes.length > 0 ? (
          filteredProgrammes.map((p) => (
            <div key={p.id} className="programme-card">
              <h3>{p.name}</h3>
              <p><strong>Status:</strong> {p.status}</p>
              <p><strong>Actions:</strong> {p.actions}</p>
              <p><strong>Owner:</strong> {p.owner}</p>
              <p><strong>Period:</strong> {p.period}</p>
            </div>
          ))
        ) : (
          <div className="no-results">No programmes match current filters.</div>
        )}
      </div>
    </div>
  );
};

export default GovernanceProgrammeDashboard;
