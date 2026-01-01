// @ts-nocheck
import React, { useState } from "react";
import CreateTaskModal from "./CreateTaskModal";

/*
=====================================================================
METRA — PreProjectFooter.jsx
RESTORED FROM:
baseline-2025-12-30-stage28-step1-create-task-modal

RESTORATION PURPOSE:
• Reinstate modal-based task creation (regression fix)
• Preserve Stage 38+ summary creation (App-owned)
• Preserve SEM-05 (summary optional for tasks)

NO DESIGN CHANGES
=====================================================================
*/

export default function PreProjectFooter({
  showCreateSummary = false,
  summaries = [],
  onCreateTaskIntent,
  onAddSummary,
}) {
  /* ---------------- Task Creation (RESTORED) ---------------- */
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  /* ---------------- Summary Creation (UNCHANGED) ---------------- */
  const [showIntentAck, setShowIntentAck] = useState(false);
  const [summaryTitle, setSummaryTitle] = useState("");

  /* ---------------- Create Task ---------------- */
  const handleCreateTaskClick = () => {
    setTaskModalOpen(true);
  };

  /* ---------------- Create Summary ---------------- */
  const handleCreateSummaryClick = () => {
    if (typeof onAddSummary !== "function") {
      console.error(
        "Create Summary clicked but onAddSummary prop is not provided"
      );
      return;
    }

    if (!summaryTitle.trim()) {
      alert("Please enter a summary title.");
      return;
    }

    // Intent acknowledgement (Stage 33 semantics preserved)
    setShowIntentAck(true);

    // Actual summary creation (Stage 38 canonical path)
    onAddSummary(summaryTitle.trim());

    // Reset input
    setSummaryTitle("");
  };

  return (
    <>
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
          <div style={{ marginTop: "8px" }}>
            <input
              type="text"
              placeholder="Summary title"
              value={summaryTitle}
              onChange={(e) => setSummaryTitle(e.target.value)}
              style={{
                marginRight: "6px",
                padding: "4px 6px",
                fontSize: "0.85rem",
              }}
            />
            <button
              type="button"
              className="create-summary-button"
              onClick={handleCreateSummaryClick}
            >
              Create Summary
            </button>
          </div>
        )}

        {/* ================= INTENT ACK ================= */}
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

      {/* ================= TASK CREATION MODAL (RESTORED) ================= */}
      <CreateTaskModal
        isOpen={taskModalOpen}
        summaries={summaries}
        onCancel={() => setTaskModalOpen(false)}
        onSubmit={(intent) => {
          if (typeof onCreateTaskIntent === "function") {
            onCreateTaskIntent(intent);
          } else {
            console.error("onCreateTaskIntent is not provided");
          }
          setTaskModalOpen(false);
        }}
      />
    </>
  );
}
