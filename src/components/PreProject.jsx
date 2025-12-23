import { useState } from "react";
import AddItemPopup from "./AddItemPopup";

/*
=====================================================================
METRA — PreProject.jsx
Stage 13.0-C — Confirmed Summary Deletion (Workspace-only)

• Summaries are inert workspace entities
• Deletion requires explicit confirmation
• Tasks are NOT affected (summaryId → null only)
• No “Unassigned” pseudo-summary rendered
• Toast shown on successful deletion
=====================================================================
*/

export default function PreProject({
  initialTasks = [],
  initialSummaries = []
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [summaries, setSummaries] = useState(initialSummaries);
  const [popupMode, setPopupMode] = useState(null);

  // Inline delete confirmation state
  const [pendingDeleteSummaryId, setPendingDeleteSummaryId] = useState(null);

  // Toast state
  const [toast, setToast] = useState(null);

  /* -------------------------------------------------
     Add Summary (already wired elsewhere)
  ------------------------------------------------- */
  function handleAddSummary({ title }) {
    const newSummary = {
      id: crypto.randomUUID(),
      title
    };

    setSummaries(prev => [...prev, newSummary]);
    setPopupMode(null);
  }

  /* -------------------------------------------------
     Stage 13.0-C — Confirmed Summary Deletion
  ------------------------------------------------- */
  function requestDeleteSummary(summaryId) {
    setPendingDeleteSummaryId(summaryId);
  }

  function cancelDeleteSummary() {
    setPendingDeleteSummaryId(null);
  }

  function confirmDeleteSummary(summaryId) {
    // Remove summary entity
    setSummaries(prev =>
      prev.filter(summary => summary.id !== summaryId)
    );

    // Orphan tasks only (no deletion)
    setTasks(prev =>
      prev.map(task =>
        task.summaryId === summaryId
          ? { ...task, summaryId: null }
          : task
      )
    );

    setPendingDeleteSummaryId(null);
    setToast("Summary removed from workspace — tasks unaffected");

    setTimeout(() => setToast(null), 3000);
  }

  /* -------------------------------------------------
     Render helpers
  ------------------------------------------------- */
  const tasksForSummary = id =>
    tasks.filter(task => task.summaryId === id);

  const orphanTasks = tasks.filter(task => task.summaryId == null);

  /* -------------------------------------------------
     Render
  ------------------------------------------------- */
  return (
    <div className="preproject-workspace">
      {/* Footer actions (temporary host) */}
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setPopupMode("add-summary")}>
          Add Summary
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div
          style={{
            marginBottom: "0.5rem",
            padding: "0.5rem",
            background: "#f0f0f0"
          }}
        >
          {toast}
        </div>
      )}

      {/* Orphan tasks — NO “Unassigned” header */}
      {orphanTasks.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}

      {/* Summaries */}
      {summaries.map(summary => (
        <section key={summary.id}>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            {summary.title}

            {pendingDeleteSummaryId === summary.id ? (
              <>
                <button
                  onClick={() => confirmDeleteSummary(summary.id)}
                >
                  Confirm
                </button>
                <button onClick={cancelDeleteSummary}>
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => requestDeleteSummary(summary.id)}
                title="Remove summary"
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                ×
              </button>
            )}
          </h3>

          {tasksForSummary(summary.id).map(task => (
            <div key={task.id}>{task.title}</div>
          ))}
        </section>
      ))}

      {/* Add Summary popup */}
      {popupMode === "add-summary" && (
        <AddItemPopup
          mode="add-summary"
          onConfirm={handleAddSummary}
          onCancel={() => setPopupMode(null)}
        />
      )}
    </div>
  );
}
