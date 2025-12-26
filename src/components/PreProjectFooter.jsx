// src/components/PreProjectFooter.jsx
// Stage 18.2 — Workspace Task Creation (Read-Only, Enforcement-Safe)

import React from "react";

// NOTE:
// emitIntent is intentionally local and mirrors RepositoryView.
// We reuse the existing intent system rather than creating tasks directly.

export default function PreProjectFooter({ currentUser, effectivePM }) {
  const emitIntent = (type, payload = null) => {
    window.dispatchEvent(
      new CustomEvent("METRA_INTENT", {
        detail: { type, payload },
      })
    );
  };

  const handleAddTask = () => {
    // PM-only guard (fallback already resolved upstream)
    if (!effectivePM || currentUser.id !== effectivePM.id) {
      return;
    }

    emitIntent("INSTANTIATE_TASK_INTENT", {
      source: "workspace",
      task: {
        id: crypto.randomUUID(),
        title: "New Task",
        createdBy: currentUser.id,
        pmOwner: effectivePM.id,
        assignedTo: null,
        notes: [],
      },
    });
  };

  return (
    <div className="preproject-footer">
      <button onClick={() => emitIntent("ADD_SUMMARY_INTENT")}>
        Add Summary
      </button>

      {/* Stage 18.2 — Workspace task creation */}
      <button onClick={handleAddTask}>
        Add Task
      </button>

      <button onClick={() => emitIntent("OPEN_REPOSITORY_INTENT")}>
        Open Repository
      </button>
    </div>
  );
}
