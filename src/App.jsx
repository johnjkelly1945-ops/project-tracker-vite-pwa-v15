// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Summary from "./components/Summary";
import PreProject from "./components/PreProject";
import "./Styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Summary />} />
        <Route path="/preproject" element={<PreProject />} />
      </Routes>
    </Router>
  );
}

export default App;
