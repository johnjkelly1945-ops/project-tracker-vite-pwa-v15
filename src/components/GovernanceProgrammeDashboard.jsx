/* ======================================================================
   METRA – GovernanceProgrammeDashboard.jsx
   Phase 4.6 A.9 Step 1A – Animation Layer Stabilised (Safari Verified)
   ----------------------------------------------------------------------
   Adds fade + slide-up animation for programme cards with layout-safe
   transforms to prevent Safari scroll bounce at end of list.
   ====================================================================== */

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import FilterBar from "./FilterBar";
import { getGovernanceData } from "../utils/GovernanceDataBridge";
import "./GovernanceProgrammeDashboard.css";

const GovernanceProgrammeDashboard = () => {
  const [programmes, setProgrammes] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");

  // === Load data once ===
  useEffect(() => {
    const data = getGovernanceData();
    console.log(
      "GovernanceDataBridge → loaded",
      data.length,
      "programme records"
    );
    setProgrammes(data);
  }, []);

  // === Apply filters ===
  const filteredProgrammes = useMemo(() => {
    return programmes.filter((p) => {
      const matchRole = roleFilter ? p.owner === roleFilter : true;
      const matchStatus = statusFilter ? p.status === statusFilter : true;
      const matchPeriod = periodFilter ? p.period === periodFilter : true;
      return matchRole && matchStatus && matchPeriod;
    });
  }, [programmes, roleFilter, statusFilter, periodFilter]);

  return (
    <div className="governance-dashboard">
      {/* ===== Fixed header + filter section ===== */}
      <div className="dashboard-header-wrapper">
        <h2 className="dashboard-header">
          Programme Roll-Up Dashboard · Live Governance Feed
        </h2>
        <FilterBar
          onRoleChange={setRoleFilter}
          onStatusChange={setStatusFilter}
          onPeriodChange={setPeriodFilter}
        />
      </div>

      {/* ===== Scrollable content section ===== */}
      <div className="dashboard-scroll-area">
        <div className="programme-card-grid">
          {filteredProgrammes.length > 0 ? (
            filteredProgrammes.map((p, i) => (
              <motion.div
                key={p.id}
                className="programme-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
                style={{
                  transformOrigin: "top center",
                  willChange: "transform, opacity",
                }}
                layout="position" // prevents reflow bounce in Safari
              >
                <h3>{p.name}</h3>
                <p>
                  <strong>Status:</strong> {p.status}
                </p>
                <p>
                  <strong>Actions:</strong> {p.actions}
                </p>
                <p>
                  <strong>Owner:</strong> {p.owner}
                </p>
                <p>
                  <strong>Period:</strong> {p.period}
                </p>
              </motion.div>
            ))
          ) : (
            <div className="no-results">
              No programmes match current filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GovernanceProgrammeDashboard;
