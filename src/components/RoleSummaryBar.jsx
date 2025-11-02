/* ======================================================================
   METRA – RoleSummaryBar.jsx
   Phase 4.6 A.3B – Styling & Polish
   ====================================================================== */
import React from "react";

export default function RoleSummaryBar({ roleStats }) {
  const roles = [
    { label: "ADMIN", value: roleStats.admin, key: "admin" },
    { label: "PMO", value: roleStats.pmo, key: "pmo" },
    { label: "PM", value: roleStats.pm, key: "pm" },
    { label: "USER", value: roleStats.user, key: "user" },
  ];

  return (
    <div className="role-summary-bar">
      {roles.map((r) => (
        <div key={r.key} className="role-block" data-role={r.key}>
          <strong>{r.label}</strong>
          <span>{r.value}</span>
        </div>
      ))}
    </div>
  );
}
