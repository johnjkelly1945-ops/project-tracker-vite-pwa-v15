/* ======================================================================
   METRA – GovernanceProgrammeDashboard.jsx
   Phase 4.6 A.8 Step 2 – Live Data + Filter Bar Integration
   ----------------------------------------------------------------------
   Displays live governance feed via GovernanceDataBridge and provides
   dropdown filters (Role, Status, Period). Verified for Safari 18.
   ====================================================================== */

import React from "react";
import { motion } from "framer-motion";
import { useGovernanceDataBridge } from "../utils/GovernanceDataBridge";
import "../styles/GovernanceProgrammeDashboard.css";
import "../styles/FilterBar.css";

export default function GovernanceProgrammeDashboard() {
  // 🔹 Live data from GovernanceDataBridge (refresh every 10s)
  const governanceData = useGovernanceDataBridge(10000);

  return (
    <div className="programme-root">
      {/* ===== Header Section ===== */}
      <header className="dashboard-header">
        <h1>Programme Roll-Up Dashboard</h1>
        <p>Live Governance Feed (Phase 4.6 A.8 – Filter Bar Integration)</p>
      </header>

      {/* ===== Filter Bar ===== */}
      <div className="filter-bar">
        <select>
          <option>All Roles</option>
          <option>PMO</option>
          <option>Project Manager</option>
        </select>
        <select>
          <option>All Status</option>
          <option>Green</option>
          <option>Amber</option>
          <option>Red</option>
        </select>
        <select>
          <option>All Periods</option>
          <option>Q1</option>
          <option>Q2</option>
          <option>Q3</option>
          <option>Q4</option>
        </select>
      </div>

      {/* ===== Programme Cards ===== */}
      <main className="programme-grid">
        {governanceData && governanceData.length > 0 ? (
          governanceData.map((programme, index) => (
            <motion.div
              key={index}
              className="programme-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2>{programme.programme || "Unnamed Programme"}</h2>
              <p>
                <strong>Owner:</strong> {programme.owner || "—"}
              </p>
              <p>
                <strong>Status:</strong> {programme.status || "—"}
              </p>
              <p>
                <strong>Projects:</strong>{" "}
                {programme.projects && programme.projects.length > 0 ? (
                  programme.projects.map((p, i) => (
                    <span key={i}>
                      {p.name}
                      {i < programme.projects.length - 1 ? ", " : ""}
                    </span>
                  ))
                ) : (
                  "—"
                )}
              </p>
            </motion.div>
          ))
        ) : (
          <p className="no-data">No governance data available</p>
        )}
      </main>
    </div>
  );
}
