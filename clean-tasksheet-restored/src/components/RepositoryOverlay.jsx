/* ======================================================================
   METRA – RepositoryOverlay.jsx
   Stage 10.1 – Read-Only Repository Rendering
   (Canonical Stage 8/9 Repository Shape)
   ----------------------------------------------------------------------
   ✔ Uses taskLibrary.bundles explicitly
   ✔ Read-only
   ✔ No selection
   ✔ No routing
   ✔ No export
   ====================================================================== */

import React, { useEffect } from "react";
import { taskLibrary } from "../repository/tasklibrary";

export default function RepositoryOverlay({ onClose }) {
  /* ==============================================================
     Canonical repository access (Stage 8/9)
     ============================================================== */

  const bundles = taskLibrary.bundles;

  useEffect(() => {
    console.info("[Stage 10.1] RepositoryOverlay mounted (read-only)");
    console.info("[Stage 10.1] Bundles loaded:", bundles.length);
  }, [bundles]);

  /* ==============================================================
     Render
     ============================================================== */

  return (
    <div
      className="repository-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}
    >
      <div
        style={{
          width: "80vw",
          height: "80vh",
          background: "#fff",
          borderRadius: "8px",
          padding: "16px",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px"
          }}
        >
          <h2>Repository</h2>
          <button onClick={onClose}>Close</button>
        </div>

        {/* Repository Content (Read-Only) */}
        <div style={{ overflow: "auto", flex: 1 }}>
          {bundles.map((bundle) => (
            <div
              key={bundle.bundleId}
              style={{
                marginBottom: "16px",
                paddingBottom: "8px",
                borderBottom: "1px solid #e0e0e0"
              }}
            >
              <h3>{bundle.title}</h3>

              {bundle.summaries.map((summary) => (
                <div
                  key={summary.repoSummaryId}
                  style={{ marginLeft: "16px", marginBottom: "8px" }}
                >
                  <strong>{summary.title}</strong>

                  <ul style={{ marginLeft: "16px", marginTop: "4px" }}>
                    {summary.tasks.map((task) => (
                      <li key={task.id}>{task.title}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "12px",
            paddingTop: "8px",
            borderTop: "1px solid #e0e0e0",
            textAlign: "right",
            fontSize: "12px",
            color: "#666"
          }}
        >
          Repository is in read-only mode (Stage 10.1)
        </div>
      </div>
    </div>
  );
}
