/* ======================================================================
   METRA – GovernanceProgrammeDashboard.jsx
   Phase 4.6 A.9 Step 2 – RAG Accent Integration (Scroll-Stable)
   ----------------------------------------------------------------------
   Adds left status accent bar to each programme card.
   Colour logic: Green=On Track, Amber=At Risk, Red=Off Track.
   ====================================================================== */

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import FilterBar from "./FilterBar";
import { getGovernanceData } from "../utils/GovernanceDataBridge";
import "./GovernanceProgrammeDashboard.css";

// === RAG Colour Helper ===
const getStatusColor = (status) => {
  if (!status) return "#cbd5e1"; // neutral grey fallback
  const s = status.toLowerCase();
  if (s.includes("on")) return "#16a34a";      // green
  if (s.includes("risk")) return "#f59e0b";    // amber
  if (s.includes("off")) return "#dc2626";     // red
  return "#94a3b8";                            // default grey-blue
};

const GovernanceProgrammeDashboard = () => {
  const [programmes, setProgrammes] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");

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

  return (
    <div className="governance-dashboard">
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
                  borderLeft: `6px solid ${getStatusColor(p.status)}`,
                }}
                layout="position"
              >
                <h3>{p.name}</h3>
                <p><strong>Status:</strong> {p.status}</p>
                <p><strong>Actions:</strong> {p.actions}</p>
                <p><strong>Owner:</strong> {p.owner}</p>
                <p><strong>Period:</strong> {p.period}</p>
              </motion.div>
            ))
          ) : (
            <div className="no-results">No programmes match current filters.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GovernanceProgrammeDashboard;
