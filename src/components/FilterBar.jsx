/* ======================================================================
   METRA – FilterBar.jsx
   Phase 4.6 A.8 Step 3 – Stage 1: State Base Integration
   ----------------------------------------------------------------------
   Adds local state management and console logging for dropdown changes.
   ====================================================================== */

import React, { useState } from "react";
import "../Styles/FilterBar.css";

const FilterBar = () => {
  // === Local state for each filter ===
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [period, setPeriod] = useState("");

  // === Handlers for dropdown changes ===
  const handleRoleChange = (e) => {
    setRole(e.target.value);
    console.log("Role filter selected:", e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    console.log("Status filter selected:", e.target.value);
  };

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
    console.log("Period filter selected:", e.target.value);
  };

  return (
    <div className="filter-bar">
      <div className="filter-item">
        <label htmlFor="roleSelect">Role</label>
        <select
          id="roleSelect"
          name="roleSelect"
          value={role}
          onChange={handleRoleChange}
        >
          <option value="">All</option>
          <option value="Admin">Admin</option>
          <option value="PMO">PMO</option>
          <option value="ProjectManager">Project Manager</option>
          <option value="User">User</option>
        </select>
      </div>

      <div className="filter-item">
        <label htmlFor="statusSelect">Status</label>
        <select
          id="statusSelect"
          name="statusSelect"
          value={status}
          onChange={handleStatusChange}
        >
          <option value="">All</option>
          <option value="OnTrack">On Track</option>
          <option value="AtRisk">At Risk</option>
          <option value="Overdue">Overdue</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="filter-item">
        <label htmlFor="periodSelect">Period</label>
        <select
          id="periodSelect"
          name="periodSelect"
          value={period}
          onChange={handlePeriodChange}
        >
          <option value="">All</option>
          <option value="ThisMonth">This Month</option>
          <option value="Quarter">This Quarter</option>
          <option value="Year">This Year</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
