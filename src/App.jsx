// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Summary from "./components/Summary";
import PreProject from "./components/PreProject";
import "./Styles/App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Main summary view */}
          <Route path="/" element={<Summary />} />

          {/* Dedicated full-width PreProject window */}
          <Route
            path="/preproject"
            element={
              <div className="preproject-page">
                <PreProject />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
