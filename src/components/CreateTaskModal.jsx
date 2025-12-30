// @ts-nocheck
import { useState } from "react";

/*
=====================================================================
METRA — CreateTaskModal.jsx
Stage 28 — Step 1
UI Request Surface (No Authority)
=====================================================================
*/

export default function CreateTaskModal({
  isOpen,
  summaries,
  onSubmit,
  onCancel,
}) {
  const [title, setTitle] = useState("");
  const [summaryId, setSummaryId] = useState("");

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit({
      title: trimmed,
      summaryId: summaryId || null,
    });
    setTitle("");
    setSummaryId("");
  }

  function handleCancel() {
    setTitle("");
    setSummaryId("");
    onCancel();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "16px",
          width: "360px",
          borderRadius: "6px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Create Task</h3>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <label>
              Task title
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "100%", marginTop: "6px" }}
                autoFocus
              />
            </label>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>
              Link to summary (optional)
              <select
                value={summaryId}
                onChange={(e) => setSummaryId(e.target.value)}
                style={{ width: "100%", marginTop: "6px" }}
              >
                <option value="">— None —</option>
                {summaries.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
