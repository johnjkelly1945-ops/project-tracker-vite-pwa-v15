/* ======================================================================
   METRA – PreProject.jsx (Clean Tasksheet Recovery Wrapper)
   ----------------------------------------------------------------------
   ✔ Loads the correct Dual Workspace (PreProjectDual)
   ✔ Ensures App.jsx can mount cleanly
   ✔ Provides a stable entry point
   ====================================================================== */

import React from "react";
import PreProjectDual from "./PreProjectDual.jsx";

export default function PreProject() {
  return (
    <div className="preproject-page-wrapper">
      <PreProjectDual />
    </div>
  );
}
