import React, { useState } from "react";

/*
=====================================================================
METRA — PreProjectFooter.jsx
Stage 38 — Summary Creation (App-Owned State)

CHANGES FROM STAGE 35:
• Summary creation delegated to App.jsx via onAddSummary
• No domain persistence here
• Intent acknowledgement preserved
• Title required to create a summary
=====================================================================
*/

export default function PreProjectFooter({
  showCreateSummary = false,
  onCreateTaskIntent,
  onAddSummary,
}) {
  const [showIntentAck, setShowIntentAck] = useState(false);
  const [summaryTitle, setSummaryTitle] = useState("");

  /* ---------------- Create Task ---------------- */
  const handleCreateTaskClick = () => {
    if (typeof onCreateTaskIntent !== "function") {
      console.error(
        "Create Task clicked but onCreateTaskIntent prop is not provided"
      );
      return;
    }
    onCreateTaskIntent();
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
  );
}
