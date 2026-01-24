// @ts-nocheck
/*
=====================================================================
METRA — CanonicalTaskPopupHeader.jsx
Stage 196 — Header immediacy & composition
---------------------------------------------------------------------
• Header reflects assignment immediately
• Task identity rendered as: Title — Assignee
• Minimal "Notes" indicator added (no new section)
• No semantic or behavioural change
=====================================================================
*/

export default function CanonicalTaskPopupHeader({ task, onClose }) {
  if (!task) return null;

  const assignee =
    task.assigneeLabel || task.assigneeId || "";

  const titleLine = assignee
    ? `${task.title} — ${assignee}`
    : task.title;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0 }}>
          {titleLine}
        </h3>

        <button
          onClick={onClose}
          aria-label="Close task popup"
        >
          ×
        </button>
      </div>

      <div
        style={{
          marginTop: "6px",
          textAlign: "center",
          fontSize: "14px",
          color: "#555",
        }}
      >
        Notes
      </div>
    </div>
  );
}
