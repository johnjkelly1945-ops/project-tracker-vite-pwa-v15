/* ======================================================================
   METRA – GovernanceFilters.jsx
   Phase 4.6 A.3C – Data Integration
   ====================================================================== */
import React from "react";

export default function GovernanceFilters({ onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange && onChange((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="governance-filters">
      <label>
        Project
        <select name="project" onChange={handleChange}>
          <option>All</option>
          <option>Project A</option>
          <option>Project B</option>
        </select>
      </label>

      <label>
        Type
        <select name="type" onChange={handleChange}>
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
        <select name="status" onChange={handleChange}>
          <option>All</option>
          <option>Active</option>
          <option>Closed</option>
        </select>
      </label>
    </div>
  );
}
