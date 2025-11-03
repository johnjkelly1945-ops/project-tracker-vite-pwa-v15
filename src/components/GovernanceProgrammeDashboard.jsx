/* ======================================================================
   METRA – GovernanceProgrammeDashboard.jsx
   Phase 4.6 A.7 Step 1 – Static Layout Framework
   ----------------------------------------------------------------------
   Displays top-level programme metrics using static sample data.
   Will later connect to Governance data store (Step 2).
   ====================================================================== */

import React from "react";
import "./GovernanceProgrammeDashboard.css";

const GovernanceProgrammeDashboard = () => {
  // === Demo static data for Step 1 ===
  const summaryData = [
    { id: 1, title: "Total Projects", value: 5, colour: "blue" },
    { id: 2, title: "Open Actions", value: 38, colour: "amber" },
    { id: 3, title: "Overdue Items", value: 6, colour: "red" },
    { id: 4, title: "On Track", value: "82%", colour: "green" },
  ];

  return (
    <div className="programme-dashboard">
      {/* ===== Fixed Header ===== */}
      <header className="programme-header">
        <h1>Programme Roll-Up Dashboard</h1>
        <p className="programme-subtitle">
          Overview of active projects and governance status
        </p>
      </header>

      {/* ===== Summary Metrics Bar ===== */}
      <section className="programme-summary-grid">
        {summaryData.map((item) => (
          <div key={item.id} className={`summary-card ${item.colour}`}>
            <div className="summary-value">{item.value}</div>
            <div className="summary-title">{item.title}</div>
            <span className={`rag-dot ${item.colour}`}></span>
          </div>
        ))}
      </section>

      {/* ===== Placeholder for Extended View ===== */}
      <section className="programme-placeholder">
        <p>
          Detailed programme roll-up metrics will appear here in Step 2,
          including per-project breakdowns and live RAG summaries.
        </p>
      </section>
    </div>
  );
};

export default GovernanceProgrammeDashboard;
