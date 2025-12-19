/* ======================================================================
   METRA – RepositoryOverlay.jsx
   Stage 11.0 – Deterministic Repository Test Bed
   ----------------------------------------------------------------------
   ✔ Inline deterministic repo payload (NO real repo)
   ✔ Intent-only selection
   ✔ No adapter, no workspace mutation
   ✔ To be removed after Stage 11.0
   ====================================================================== */

import React from "react";
import TaskRepositorySandbox from "../sandbox/repo-integration/TaskRepositorySandbox";

const STAGE_11_REPO_SEED = {
  bundles: [
    {
      id: "bundle-mgmt",
      title: "Management",
      summaries: [
        {
          id: "sum-mgmt-1",
          title: "Management Summary",
          tasks: [
            { id: "task-mgmt-1", title: "Define Governance Approach" },
            { id: "task-mgmt-2", title: "Identify Stakeholders" }
          ]
        }
      ]
    },
    {
      id: "bundle-dev",
      title: "Development",
      summaries: [
        {
          id: "sum-dev-1",
          title: "Development Summary",
          tasks: [
            { id: "task-dev-1", title: "Draft Requirements" },
            { id: "task-dev-2", title: "Initial Technical Assessment" }
          ]
        }
      ]
    }
  ]
};

export default function RepositoryOverlay({ onClose, onExport }) {
  console.log("🧪 Stage 11.0 repo seed injected", STAGE_11_REPO_SEED);

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
          repositoryData={STAGE_11_REPO_SEED}
          onExport={onExport}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
