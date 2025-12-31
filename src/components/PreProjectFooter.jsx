import React, { useState } from "react";

/*
=====================================================================
METRA — PreProjectFooter.jsx
Stage 35 — Summary Shell Persistence (Footer-Adjacent, Corrected)
=====================================================================
*/

// Stage 35 — domain imports
import { canCreateSummary } from "../domain/summary/SummaryAuthorityGate.js";
import { createSummaryShell } from "../domain/summary/SummaryShellFactory.js";
import { persistSummaryShell } from "../domain/summary/SummaryRepository.js";

export default function PreProjectFooter({
  summaries, // passed but not used here (intentionally)
  showCreateSummary = false,

  // CANONICAL task creation hook (from PreProject.jsx)
  onCreateTaskIntent,

  // Context
  workspaceId,
  actorId,
  workspaceOwnerId,
}) {
  const [showIntentAck, setShowIntentAck] = useState(false);

  /* ---------------- Create Task (RESTORED, CANONICAL) ---------------- */
  const handleCreateTaskClick = () => {
    if (typeof onCreateTaskIntent !== "function") {
      console.error(
        "Create Task clicked but onCreateTaskIntent prop is not provided"
      );
      return;
    }

    onCreateTaskIntent();
  };

  /* ---------------- Create Summary (Stage 33 + 35) ---------------- */
  const handleCreateSummaryClick = () => {
    // Stage 33 — intent acknowledgement
    setShowIntentAck(true);

    // Stage 35 — authority gate
    const authorised = canCreateSummary({
      actorId,
      workspaceOwnerId,
    });

    if (!authorised) return;

    const summaryShell = createSummaryShell({
      workspaceId,
      createdBy: actorId,
    });

    if (!summaryShell) return;

    persistSummaryShell(summaryShell);
  };

  return (
    <footer className="preproject-footer">
      {/* ================= CREATE TASK ================= */}
      <button
        type="button"
        className="create-task-button"
        onClick={handleCreateTaskClick}
      >
        Create Task
      </button>

      {/* ================= CREATE SUMMARY ================= */}
      {showCreateSummary && (
        <button
          type="button"
          className="create-summary-button"
          onClick={handleCreateSummaryClick}
        >
          Create Summary
        </button>
      )}

      {/* ================= STAGE 33 INTENT ACK ================= */}
      {showIntentAck && (
        <div
          style={{
            marginTop: "10px",
            padding: "8px 10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "#f8f9fa",
            fontSize: "0.85rem",
            maxWidth: "420px",
          }}
        >
          <strong>Summary creation intent registered.</strong>
          <div>No summary has been activated.</div>

          <button
            type="button"
            style={{ marginTop: "6px", fontSize: "0.8rem" }}
            onClick={() => setShowIntentAck(false)}
          >
            Dismiss
          </button>
        </div>
      )}
    </footer>
  );
}
