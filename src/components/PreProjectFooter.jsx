// @ts-nocheck
import { useState } from "react";
import CreateTaskModal from "./CreateTaskModal";

/*
=====================================================================
METRA — PreProjectFooter.jsx
Stage 32.2 — Summary Instantiation (Render-Only Footer Gating)

• Render-only change
• No persistence
• No summary creation behaviour
• Summary control visibility gated by parent
=====================================================================
*/

export default function PreProjectFooter({
  summaries,
  onCreateTaskIntent,
  showCreateSummary = false, // Stage 32.2 — explicit, render-only gate
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
        {/* Existing behaviour — unchanged */}
        <button onClick={() => setOpen(true)}>Add Task</button>

        {/* Stage 32.2 — Create Summary (render-only, inert) */}
        {showCreateSummary && (
          <button
            type="button"
            onClick={() => {
              // Intentionally inert — Stage 32.2 is render-only
              console.info(
                "Create Summary clicked (Stage 32.2 — no behaviour yet)"
              );
            }}
          >
            Create Summary
          </button>
        )}
      </div>

      <CreateTaskModal
        isOpen={open}
        summaries={summaries}
        onCancel={() => setOpen(false)}
        onSubmit={(intent) => {
          onCreateTaskIntent(intent);
          setOpen(false);
        }}
      />
    </>
  );
}
