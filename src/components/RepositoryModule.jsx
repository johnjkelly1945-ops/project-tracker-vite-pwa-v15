/* ======================================================================
   METRA – RepositoryModule.jsx
   Version: v6.1 Restored (Stable for v6.2 Reintegration)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Provides working Repository module during PreProject restoration
   ✔ Simple, stable structure
   ✔ No DualPane or popup logic
   ✔ Safe class names (repo- prefix)
   ====================================================================== */

import React, { useState } from "react";
import "../Styles/RepositoryModule.css";

export default function RepositoryModule() {
  const [activeView, setActiveView] = useState("management");

  /* -------------------------------------------------------------------
     Example template sets (placeholder only)
     These match the simple working repository from your last baseline.
     ------------------------------------------------------------------- */
  const managementTemplates = [
    { id: "m1", name: "Scope Summary Template" },
    { id: "m2", name: "Stakeholder Plan Template" },
    { id: "m3", name: "Governance Checklist" }
  ];

  const developmentTemplates = [
    { id: "d1", name: "Requirements Outline" },
    { id: "d2", name: "Design Structure Template" },
    { id: "d3", name: "Build Checklist" }
  ];

  const templates =
    activeView === "management" ? managementTemplates : developmentTemplates;

  /* -------------------------------------------------------------------
     UI RENDER
     ------------------------------------------------------------------- */
  return (
    <div className="repo-wrapper">

      {/* ================================================================
           REPOSITORY HEADER
         ================================================================ */}
      <div className="repo-header">
        <h2>Template Repository</h2>

        {/* Toggle buttons */}
        <div className="repo-toggle">
          <button
            className={
              activeView === "management"
                ? "repo-toggle-btn active"
                : "repo-toggle-btn"
            }
            onClick={() => setActiveView("management")}
          >
            Management
          </button>

          <button
            className={
              activeView === "development"
                ? "repo-toggle-btn active"
                : "repo-toggle-btn"
            }
            onClick={() => setActiveView("development")}
          >
            Development
          </button>
        </div>
      </div>

      {/* ================================================================
           TEMPLATE LIST
         ================================================================ */}
      <div className="repo-list">
        {templates.map((t) => (
          <div key={t.id} className="repo-item">
            {t.name}
          </div>
        ))}
      </div>

      {/* ================================================================
           FOOTER ACTION (Placeholder)
         ================================================================ */}
      <div className="repo-footer">
        <button className="repo-action-btn">
          Download Selection to PreProject
        </button>
      </div>

    </div>
  );
}
