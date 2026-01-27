// @ts-nocheck
/*
=====================================================================
METRA — CanonicalTaskPopupHeader.jsx
Stage 223 — Authoritative Header (Separated Identity)
=====================================================================
• UI-only refinement
• Title precedes assignee
• Centred identity group
• Subtle separator indicates association without fusion
• No behavioural or authority changes
=====================================================================
*/

export default function CanonicalTaskPopupHeader({ task }) {
  if (!task) return null;

  return (
    <div
      style={{
        background: "#0b3a66",
        color: "#fff",
        padding: "14px 18px",
        borderTopLeftRadius: "6px",
        borderTopRightRadius: "6px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            flexWrap: "wrap",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "1.2em",
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            {task.title}
          </div>

          {task.assigneeId && (
            <>
              <span
                style={{
                  opacity: 0.6,
                  fontSize: "1.1em",
                  lineHeight: 1,
                }}
              >
                –
              </span>

              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontSize: "0.85em",
                  whiteSpace: "nowrap",
                }}
              >
                {task.assigneeLabel || task.assigneeId}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
