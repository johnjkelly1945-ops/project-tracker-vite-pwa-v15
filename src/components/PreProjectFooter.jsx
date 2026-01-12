/*
=====================================================================
METRA — PreProjectFooter.jsx
Stage 104.3.B — Summary Ordering Controls (Activation-Gated)
Stage 106.2   — Summary Removal Control (Footer-Only)
Stage 106.3   — Confirmation + Failure Surfacing
=====================================================================
*/

import { useState, useEffect } from "react";
import CreateTaskModal from "./CreateTaskModal";

export default function PreProjectFooter({
  summaries = [],
  activeSummaryId = null,
  moveActiveSummary,
  showCreateSummary = false,
  onCreateTaskIntent,
  onAddSummary,
  onRemoveSummary,
}) {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [summaryTitle, setSummaryTitle] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [failure, setFailure] = useState(false);

  const activeIndex =
    activeSummaryId != null
      ? summaries.findIndex((s) => s.id === activeSummaryId)
      : -1;

  const hasActiveSummary = activeIndex !== -1;
  const atTopBoundary = hasActiveSummary && activeIndex === 0;
  const atBottomBoundary =
    hasActiveSummary && activeIndex === summaries.length - 1;

  function requestRemove() {
    setFailure(false);
    setConfirmOpen(true);
  }

  function cancelConfirm() {
    setConfirmOpen(false);
    setFailure(false);
  }

  function confirmRemove() {
    try {
      onRemoveSummary?.(activeSummaryId);
      setConfirmOpen(false);
    } catch {
      setFailure(true);
    }
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") cancelConfirm();
    }
    if (confirmOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmOpen]);

  return (
    <>
      <footer className="preproject-footer">
        <button type="button" onClick={() => setTaskModalOpen(true)}>
          Create Task
        </button>

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

            <button type="button" onClick={requestRemove}>
              Remove
            </button>
          </div>
        )}
      </footer>

      {/* Confirmation Toast (Modal-Behaving) */}
      {confirmOpen && (
        <>
          <div
            onClick={cancelConfirm}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.3)",
              zIndex: 10000,
            }}
          />

          <div
            style={{
              position: "fixed",
              bottom: "24px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#fff",
              padding: "12px 16px",
              border: "1px solid #ccc",
              zIndex: 10001,
              minWidth: "200px",
              textAlign: "center",
            }}
          >
            {!failure ? (
              <button type="button" onClick={confirmRemove}>
                Remove
              </button>
            ) : (
              <div>Action could not be completed.</div>
            )}
          </div>
        </>
      )}

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
