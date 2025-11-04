/* ======================================================================
   METRA – GovernanceProgrammeDashboard.jsx
   Phase 4.6 A.9 Step 3A – Filter Animation Layer Stabilised (Safari Verified)
   ----------------------------------------------------------------------
   Cross-fade transitions for filtered cards with scroll-safe containment.
   Prevents Safari top-page bounce using layoutScroll and layout="position".
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
      {/* ===== Header + Filter Section ===== */}
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
