/* ==========================================================
   METRA – Role Context Provider (Phase 4.3B Stable)
   ----------------------------------------------------------
   Provides global role and governance-view state across app.
   Ensures full-width rendering and scalable permissions logic.
   ========================================================== */

import React, { createContext, useContext, useState } from "react";

// -----------------------------------------------------------
// 1️⃣  Create Context
// -----------------------------------------------------------
const RoleContext = createContext();

// -----------------------------------------------------------
// 2️⃣  Provider Component
// -----------------------------------------------------------
export const RoleProvider = ({ children }) => {
  // Default role ▸ "ProjectManager" for testing
  const [role, setRole] = useState("ProjectManager");

  // Controls visibility of Governance View
  const [showGovernance, setShowGovernance] = useState(false);

  // Derived permissions (expandable later)
  const permissions = {
    canViewGovernance: role === "Admin" || role === "PMO",
    canToggleGovernance:
      role === "Admin" || role === "PMO" || role === "ProjectManager",
    canEditAudit: role !== "User",
  };

  // Handlers
  const toggleGovernance = () => setShowGovernance(!showGovernance);
  const changeRole = (newRole) => setRole(newRole);

  // Shared context value
  const value = {
    role,
    changeRole,
    showGovernance,
    toggleGovernance,
    permissions,
  };

  // ✅ Full-width container prevents layout shrink
  return (
    <div style={{ width: "100vw", height: "100%", margin: 0, padding: 0 }}>
      <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
    </div>
  );
};

// -----------------------------------------------------------
// 3️⃣  Hook for use in any component
// -----------------------------------------------------------
export const useRole = () => useContext(RoleContext);
