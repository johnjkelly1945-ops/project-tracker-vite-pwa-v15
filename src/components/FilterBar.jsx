/* ======================================================================
   METRA – FilterBar.jsx
   Phase 4.6 A.8 Step 3 – Stage 2: Prop Flow Connection
   ----------------------------------------------------------------------
   Adds prop callbacks for Role, Status, and Period filters.
   Sends user selections to parent component (GovernanceProgrammeDashboard).
   ====================================================================== */

import React, { useState } from "react";
import "../Styles/FilterBar.css";

const FilterBar = ({ onRoleChange, onStatusChange, onPeriodChange }) => {
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [period, setPeriod] = useState("");

  const handleRoleChange = (e) => {
    const newValue = e.target.value;
    setRole(newValue);
    console.log("Role filter selected:", newValue);
    if (onRoleChange) onRoleChange(newValue);
  };

  const handleStatusChange = (e) => {
    const newValue = e.target.value;
    setStatus(newValue);
    console.log("Status filter selected:", newValue);
    if (onStatusChange) onStatusChange(newValue);
  };

  const handlePeriodChange = (e) => {
    const newValue = e.target.value;
    setPeriod(newValue);
    console.log("Period filter selected:", newValue);
    if (onPeriodChange) onPeriodChange(newValue);
  };

  return (
    <div className="filter-bar">
      <div className="filter-item">
        <label htmlFor="roleSelect">Role</label>
        <select id="roleSelect" name="roleSelect" value={role} onChange={handleRoleChange}>
          <option value="">All</option>
          <option value="Admin">Admin</option>
          <option value="PMO">PMO</option>
          <option value="ProjectManager">Project Manager</option>
          <option value="User">User</option>
        </select>
      </div>

      <div className="filter-item">
        <label htmlFor="statusSelect">Status</label>
        <select id="statusSelect" name="statusSelect" value={status} onChange={handleStatusChange}>
          <option value="">All</option>
          <option value="OnTrack">On Track</option>
          <option value="AtRisk">At Risk</option>
          <option value="Overdue">Overdue</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="filter-item">
        <label htmlFor="periodSelect">Period</label>
        <select id="periodSelect" name="periodSelect" value={period} onChange={handlePeriodChange}>
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
