import React from "react";
import PreProject from "./components/PreProject";
import Personnel from "./components/Personnel";
import Progress from "./components/Progress";
import Closure from "./components/Closure";
import "./Styles/App.v2.css";

function App() {
  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <h1>Welcome to METRA</h1>
        <p>Your personal project tracker</p>
      </div>

      {/* Modules in order */}
      <PreProject />
      <Personnel />
      <Progress />
      <Closure />
    </div>
  );
}

export default App;
