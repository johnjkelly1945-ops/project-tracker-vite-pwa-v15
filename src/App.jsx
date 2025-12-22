// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PreProject from "./components/PreProject";
import "./Styles/App.css";

/*
=====================================================================
METRA — Stage 11.0 Execution Root
---------------------------------------------------------------------
• Demo Summary dashboard deliberately unhooked
• Workspace (PreProject) is authoritative root
• No orchestration / meta-dashboard
• Routing preserved for future stages
=====================================================================
*/

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>

          {/* Stage 11: Workspace is the root */}
          <Route path="/" element={<PreProject />} />

          {/* Explicit alias (optional, kept for clarity) */}
          <Route path="/preproject" element={<PreProject />} />

          {/* Safety: redirect any unknown route to workspace */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
