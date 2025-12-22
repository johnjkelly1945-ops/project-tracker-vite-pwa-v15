// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DualPane from "./components/DualPane";
import PreProject from "./components/PreProject";
import Summary from "./components/Summary";

import "./Styles/App.css";

/*
=====================================================================
METRA — Stage 11.5.2-B
DualPane Shell Reattachment
---------------------------------------------------------------------
• PreProject mounted as LEFT pane content
• RIGHT pane intentionally empty
• No behaviour added
=====================================================================
*/

function App() {
  return (
    <Router>
      <Routes>

        {/* Summary Dashboard */}
        <Route path="/" element={<Summary />} />

        {/* PreProject Workspace inside DualPane */}
        <Route
          path="/preproject"
          element={
            <DualPane
              left={<PreProject />}
              right={<div />}   // placeholder only
            />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
