/* ======================================================================
   METRA – RoleSummaryBar.jsx
   Phase 4.6 A.3C – Safe Rendering Update
   ----------------------------------------------------------------------
   Displays summary counts by user role. Now protected against undefined
   data to avoid runtime errors.
   ====================================================================== */

import React from "react";

export default function RoleSummaryBar({ roles = {} }) {
  // Ensure safe defaults
  const safeRoles = {
    admin: roles?.admin || 0,
    pmo: roles?.pmo || 0,
    pm: roles?.pm || 0,
    user: roles?.user || 0,
  };

  return (
    <div className="role-summary-bar">
      <h3>Roles Overview</h3>
      <div className="role-grid">
        <div className="role-item">
          <strong>Admin:</strong> {safeRoles.admin}
        </div>
        <div className="role-item">
          <strong>PMO:</strong> {safeRoles.pmo}
        </div>
        <div className="role-item">
          <strong>Project Manager:</strong> {safeRoles.pm}
        </div>
        <div className="role-item">
          <strong>User:</strong> {safeRoles.user}
        </div>
      </div>
    </div>
  );
}

/* ======================================================================
   Notes:
   • Safely renders even when roles are undefined or empty.
   • Uses optional chaining and fallback values to prevent crashes.
   • Integrated into GovernanceSummary.jsx role display section.
   ====================================================================== */
