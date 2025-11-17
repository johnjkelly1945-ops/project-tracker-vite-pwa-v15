/* ======================================================================
   METRA – NavBar.jsx
   Lightweight navigation bar for switching screens
   ====================================================================== */

import React from "react";
import "../Styles/NavBar.css";

export default function NavBar({ setScreen }) {
  return (
    <div className="navbar">
      <button onClick={() => setScreen("preproject")}>
        Task Workspace
      </button>

      <button onClick={() => setScreen("repository")}>
        Repository
      </button>
    </div>
  );
}
