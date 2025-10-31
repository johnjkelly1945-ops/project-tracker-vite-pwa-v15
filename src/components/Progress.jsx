/* ==========================================================
   METRA – PreProject (Phase 4.3B)
   ----------------------------------------------------------
   Integrates Role Context to control visibility of the
   Governance Queue and “Show Governance View” toggle.
   Maintains full-width layout.
   ========================================================== */

import React from "react";
import { useRole } from "../context/RoleContext.jsx";
import "../styles/PreProject.css";

// Replace these with your actual components if already defined
import GovernanceQueue from "./GovernanceQueue.jsx";
import AuditPanel from "./AuditPanel.jsx";

export default function PreProject() {
  const { role, showGovernance, toggleGovernance, permissions } = useRole();

  return (
    <div className="preproject-container">
      {/* ===== Header ===== */}
      <header className="preproject-header">
        <h1>METRA – PreProject</h1>
        <p className="role-status">
          Current Role: <strong>{role}</strong>
        </p>
      </header>

      {/* ===== Toggle for eligible roles ===== */}
      {permissions.canToggleGovernance && (
        <div className="governance-toggle">
          <button
            onClick={toggleGovernance}
            className="toggle-btn"
            aria-label="Toggle Governance View"
          >
            {showGovernance ? "Hide Governance View" : "Show Governance View"}
          </button>
        </div>
      )}

      {/* ===== Governance Queue ===== */}
      {(permissions.canViewGovernance || showGovernance) && (
        <section className="governance-queue-section">
          <GovernanceQueue />
        </section>
      )}

      {/* ===== Audit Panel ===== */}
      <section className="audit-panel-section">
        <AuditPanel />
      </section>
    </div>
  );
}
