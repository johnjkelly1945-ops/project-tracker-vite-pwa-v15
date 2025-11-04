/* ======================================================================
   METRA – FilterBar.jsx
   Phase 4.6 A.8 Step 2 – Filter Bar Integration
   ----------------------------------------------------------------------
   Provides collapsible top filter controls for Role, Status, and Period.
   Emits selected filter states to parent dashboard for live updates.
   ====================================================================== */

import React from "react";
import "../styles/FilterBar.css";

export default function FilterBar({ filters, onFilterChange }) {
  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="filter-bar">
      <select
        value={filters.role}
        onChange={(e) => handleChange("role", e.target.value)}
      >
        <option value="All">All Roles</option>
        <option value="PMO">PMO</option>
        <option value="Project Manager">Project Manager</option>
        <option value="Sponsor">Sponsor</option>
      </select>

      <select
        value={filters.status}
        onChange={(e) => handleChange("status", e.target.value)}
      >
        <option value="All">All Status</option>
        <option value="Green">Green</option>
        <option value="Amber">Amber</option>
        <option value="Red">Red</option>
      </select>

      <select
        value={filters.period}
        onChange={(e) => handleChange("period", e.target.value)}
      >
        <option value="All">All Periods</option>
        <option value="Q1">Q1</option>
        <option value="Q2">Q2</option>
        <option value="Q3">Q3</option>
        <option value="Q4">Q4</option>
      </select>
    </div>
  );
}
