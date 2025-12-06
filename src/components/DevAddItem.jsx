/* ======================================================================
   METRA – ModuleHeader.jsx (Diagnostic Version)
   ----------------------------------------------------------------------
   ✔ Forces visible change ("REPO TEST BUTTON")
   ✔ Fires alert() so we know click handler runs
   ✔ Calls onOpenRepository() passed from App.jsx
   ====================================================================== */

import React from "react";
import "../Styles/ModuleHeader.css";

export default function ModuleHeader({ onOpenRepository }) {

  const handleRepository = () => {
    alert("HEADER CLICKED");                     // ← Diagnostic test
    console.log("Repository button pressed");

    if (onOpenRepository) {
      onOpenRepository();                        // ← Should open repository
    } else {
      console.warn("onOpenRepository NOT PROVIDED");
    }
  };

  return (
    <header className="metra-header">

      {/* LEFT SIDE – TITLE */}
      <div className="metra-header-left">
        <h1 className="metra-title">METRA Workspace</h1>
      </div>

      {/* RIGHT SIDE – BUTTON */}
      <div className="metra-header-right">
        <button className="metra-header-btn" onClick={handleRepository}>
          REPO TEST BUTTON
        </button>
      </div>

    </header>
  );
}
