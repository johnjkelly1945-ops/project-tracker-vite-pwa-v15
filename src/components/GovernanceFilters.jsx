/* ======================================================================
   METRA – GovernanceFilters.jsx
   ====================================================================== */
import React from "react";

export default function GovernanceFilters() {
  return (
    <div className="governance-filters">
      <label>
        Project 
        <select>
          <option>All Projects</option>
          <option>Project A</option>
          <option>Project B</option>
        </select>
      </label>

      <label>
        Type 
        <select>
          <option>All</option>
          <option>Change Control</option>
          <option>Risk</option>
          <option>Issue</option>
          <option>Quality</option>
          <option>Template</option>
        </select>
      </label>

      <label>
        Status 
        <select>
          <option>All</option>
          <option>Active</option>
          <option>Closed</option>
        </select>
      </label>
    </div>
  );
}
