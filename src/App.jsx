// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Summary from "./components/Summary";
import PreProject from "./components/PreProject";
import DualPane from "./components/DualPane";

import "./Styles/App.css";

/*
=====================================================================
METRA — Stage 11.6
Authoritative Routing Restore
---------------------------------------------------------------------
• Restores /preproject route
• No behaviour added
• No logic added
• Certification-safe
=====================================================================
*/

function App() {
  return (
    <Router>
      <Routes>

        {/* Summary dashboard */}
        <Route path="/" element={<Summary />} />

        {/* PreProject workspace entry */}
        <Route
          path="/preproject"
          element={
            <DualPane
              left={<PreProject />}
              right={<div />}
            />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
