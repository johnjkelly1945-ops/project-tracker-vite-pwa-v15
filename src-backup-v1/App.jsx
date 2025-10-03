import React from "react";
import PreProject from "./Components/PreProject";
import Personnel from "./Components/Personnel";
import Progress from "./Components/Progress";
import Closure from "./Components/Closure";
import "./Styles/App.css";

function App() {
  return (
    <div className="app-container">
      {/* Welcome section */}
      <div className="header">
        <h1>Welcome to METRA</h1>
        <p>Your personal project tracker</p>
      </div>

      {/* MVP blocks */}
      <div className="boxes">
        <div className="box">
          <h2>Projects</h2>
          <ul>
            <li>Project Alpha</li>
            <li>Project Beta</li>
          </ul>
        </div>

        <div className="box">
          <h2>Tasks</h2>
          <ul>
            <li>Task 1</li>
            <li>Task 2</li>
          </ul>
        </div>

        <div className="box">
          <h2>Templates</h2>
          <ul>
            <li>Project Charter</li>
            <li>Risk Log</li>
            <li>Resource Plan</li>
          </ul>
        </div>
      </div>

      {/* Original modules */}
      <PreProject />
      <Personnel />
      <Progress />
      <Closure />
    </div>
  );
}

export default App;

