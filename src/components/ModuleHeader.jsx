/* ======================================================================
   METRA – ModuleHeader.jsx
   Production Version – Repository Button Fully Wired
   ====================================================================== */

import React from "react";
import "../Styles/ModuleHeader.css";

export default function ModuleHeader({ onOpenRepository }) {

  const handleRepository = () => {
    console.log("Repository button pressed");
    if (onOpenRepository) {
      onOpenRepository();
    }
  };

  return (
    <header className="metra-header">

      {/* LEFT: App Title */}
      <div className="metra-header-left">
        <h1 className="metra-title">METRA Workspace</h1>
      </div>

      {/* RIGHT: Repository Button */}
      <div className="metra-header-right">
        <button className="metra-header-btn" onClick={handleRepository}>
          Repository
        </button>
      </div>

    </header>
  );
}
