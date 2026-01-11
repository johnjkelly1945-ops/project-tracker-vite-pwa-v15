// @ts-nocheck
import React, { useState } from "react";
import CreateTaskModal from "./CreateTaskModal";

/*
=====================================================================
METRA — PreProjectFooter.jsx
Stage 104.3.B — Summary Ordering Controls (Activation-Gated)
=====================================================================
*/

export default function PreProjectFooter({
  summaries = [],
  activeSummaryId = null,
  moveActiveSummary,
  showCreateSummary = false,
  onCreateTaskIntent,
  onAddSummary,
}) {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [summaryTitle, setSummaryTitle] = useState("");

  const activeIndex =
    activeSummaryId != null
      ? summaries.findIndex((s) => s.id === activeSummaryId)
      : -1;

  const hasActiveSummary = activeIndex !== -1;
  const atTopBoundary = hasActiveSummary && activeIndex === 0;
  const atBottomBoundary =
    hasActiveSummary && activeIndex === summaries.length - 1;

  return (
    <>
      <footer className="preproject-footer">
        {/* Create Task */}
        <button type="button" onClick={() => setTaskModalOpen(true)}>
          Create Task
        </button>

        {/* Create Summary */}
        {showCreateSummary && (
          <div style={{ marginTop: "8px" }}>
            <input
              type="text"
              placeholder="Summary title"
              value={summaryTitle}
              onChange={(e) => setSummaryTitle(e.target.value)}
              style={{ marginRight: "6px" }}
            />
            <button
              type="button"
              onClick={() => {
                if (!summaryTitle.trim()) return;
                onAddSummary(summaryTitle.trim());
                setSummaryTitle("");
              }}
            >
              Create Summary
            </button>
          </div>
        )}

        {/* Ordering Controls */}
        {hasActiveSummary && (
          <div
            className="summary-order-controls"
            style={{ marginTop: "10px", display: "flex", gap: "6px" }}
          >
            <button
              type="button"
              disabled={atTopBoundary}
              onClick={() => moveActiveSummary(activeSummaryId, "up")}
            >
              ↑ Move Up
            </button>
            <button
              type="button"
              disabled={atBottomBoundary}
              onClick={() => moveActiveSummary(activeSummaryId, "down")}
            >
              ↓ Move Down
            </button>
          </div>
        )}
      </footer>

      <CreateTaskModal
        isOpen={taskModalOpen}
        summaries={summaries}
        onCancel={() => setTaskModalOpen(false)}
        onSubmit={(intent) => {
          onCreateTaskIntent?.(intent);
          setTaskModalOpen(false);
        }}
      />
    </>
  );
}
