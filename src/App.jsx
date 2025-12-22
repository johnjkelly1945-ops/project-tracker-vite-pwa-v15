// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PreProject from "./components/PreProject";
import DualPane from "./components/DualPane";
import "./Styles/App.css";

/*
=====================================================================
METRA — Phase 1
DualPane Container Wiring
---------------------------------------------------------------------
• DualPane is presentation-only
• PreProject remains authoritative
• No behavioural changes
=====================================================================
*/

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <DualPane
              left={<PreProject />}
              right={null}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
