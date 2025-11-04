/* ======================================================================
   METRA – GovernanceProgrammeDashboard.jsx
   Phase 4.6 A.8 Step 3 – Stage 1 (FilterBar Integration)
   ----------------------------------------------------------------------
   Corrected: removes useGovernanceDataBridge import.
   Uses getGovernanceData() utility for baseline data load.
   ====================================================================== */

import React, { useEffect, useState } from "react";
import FilterBar from "./FilterBar";
import { getGovernanceData } from "../utils/GovernanceDataBridge";
import "../Styles/GovernanceProgrammeDashboard.css";

const GovernanceProgrammeDashboard = () => {
  const [programmes, setProgrammes] = useState([]);

  useEffect(() => {
    const data = getGovernanceData();
    console.log("GovernanceDataBridge → loaded", data.length, "programme records");
    setProgrammes(data);
  }, []);

  return (
    <div className="governance-dashboard">
      <h2 className="dashboard-header">
        Programme Roll-Up Dashboard · Live Governance Feed (Phase 4.6 A.8)
      </h2>

      {/* === FILTER BAR === */}
      <FilterBar />

      {/* === PROGRAMME CARDS === */}
      <div className="programme-card-grid">
        {programmes.map((p) => (
          <div key={p.id} className="programme-card">
            <h3>{p.name}</h3>
            <p><strong>Status:</strong> {p.status}</p>
            <p><strong>Actions:</strong> {p.actions}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GovernanceProgrammeDashboard;
