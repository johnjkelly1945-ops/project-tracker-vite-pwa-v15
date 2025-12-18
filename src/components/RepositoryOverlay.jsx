/* ======================================================================
   METRA – RepositoryOverlay.jsx
   Stage 9.7 – Repository Contract Normalisation
   ----------------------------------------------------------------------
   ✔ Always passes { bundles: [...] } to sandbox
   ✔ Explicit repository → UI contract
   ✔ No UI or behaviour changes
   ✔ No DualPane involvement
   ====================================================================== */

import React, { useEffect } from "react";
import TaskRepositorySandbox from "../sandbox/repo-integration/TaskRepositorySandbox";

export default function RepositoryOverlay({
  activePane,
  onExport,
  onClose
}) {
  useEffect(() => {
    console.log("🟣 RepositoryOverlay mounted (Stage 9.7)");
  }, []);

  /* --------------------------------------------------------------
     TEMPORARY STATIC DATA (STAGE 9)
     Normalised into explicit contract shape
     -------------------------------------------------------------- */
  const repositoryData = {
    bundles: [
      {
        id: "bundle-1",
        title: "Feasibility Study",
        summaries: [
          {
            id: "sum-1",
            title: "Feasibility Overview",
            tasks: [
              { id: "task-1", title: "Initial assessment" },
              { id: "task-2", title: "Stakeholder interviews" }
            ]
          }
        ]
      },
      {
        id: "bundle-2",
        title: "Business Case",
        summaries: [
          {
            id: "sum-2",
            title: "Business Case Outline",
            tasks: [
              { id: "task-3", title: "Cost analysis" },
              { id: "task-4", title: "Benefit analysis" }
            ]
          }
        ]
      }
    ]
  };

  /* --------------------------------------------------------------
     RENDER
     -------------------------------------------------------------- */
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 2000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          width: "80%",
          height: "80%",
          background: "#fff",
          borderRadius: "8px",
          overflow: "hidden"
        }}
      >
        <TaskRepositorySandbox
          repositoryData={repositoryData}
          activePane={activePane}
          onExport={onExport}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
