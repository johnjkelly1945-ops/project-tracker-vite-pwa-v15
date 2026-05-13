// @ts-nocheck
/*
=====================================================================
METRA — DualPane.jsx
Stage 178 — Header Summary Presence (Read-Only)
---------------------------------------------------------------------
• Sole owner of workspace header rendering
• Displays pane title and read-only summary presence
• No authority, no state, no interaction added
=====================================================================
*/

import React from "react";

export default function DualPane({
  mode = "dual",                 // "dual" | "single"
  focusedPane = null,            // "management" | "development" | null
  onFocusPane,                   // function(pane)
  onReturnToDual,                // function()
    activeFilter,
    onChangeFilter,
  summaryPresenceLabel = "",     // read-only display
  managementBody,
  developmentBody,
}) {
  const isDual = mode === "dual" && focusedPane === null;

  return (
    <div
      className="dual-pane-root"
      style={{
        display: "flex",
        flex: 1,
        height: "100%",
        overflow: "hidden",
      }}
    >
      {(isDual || focusedPane === "management") && (
        <div
          className="dual-pane-management"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            borderRight: isDual ? "1px solid #ddd" : "none",
          }}
        >
          <div
            className="pane-header"
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #ddd",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span>Management</span>
              {!isDual && summaryPresenceLabel && (
                <span style={{ fontWeight: "normal", color: "#666" }}>
                  · {summaryPresenceLabel}
                </span>
              )}
            </div>

              {!isDual && activeFilter && (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    fontSize: "11px",
                    fontWeight: 500,
                    marginLeft: "24px",
                    flex: 1,
                  }}
                >
                  {[
                    ["all", "ALL"],
                    ["notstarted", "NOT STARTED"],
                    ["started", "STARTED"],
                    ["submitted", "SUBMITTED"],
                    ["completed", "COMPLETED"],
                    ["flagged", "FLAGGED"],
                  ].map(([id, label]) => (
                    <span
                      key={id}
                      onClick={() => {
                        if (id === activeFilter) return;
                        onChangeFilter?.(id);
                      }}
                      style={{
                        padding: "2px 6px",
                        border:
                          id === activeFilter
                            ? "1px solid rgba(0,0,0,0.25)"
                            : "1px solid transparent",
                        borderRadius: "4px",
                        cursor:
                          id === activeFilter
                            ? "default"
                            : "pointer",
                        opacity:
                          id === activeFilter
                            ? 1
                            : 0.82,
                        userSelect: "none",
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}

            {isDual ? (
              <button type="button" onClick={() => onFocusPane("management")}>
                ↗
              </button>
            ) : (
              <button type="button" onClick={onReturnToDual}>
                ↙
              </button>
            )}
          </div>

          <div
            className="pane-body"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
            }}
          >
            {managementBody}
          </div>
        </div>
      )}

      {(isDual || focusedPane === "development") && (
        <div
          className="dual-pane-development"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            className="pane-header"
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #ddd",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span>Development</span>
              {!isDual && summaryPresenceLabel && (
                <span style={{ fontWeight: "normal", color: "#666" }}>
                  · {summaryPresenceLabel}
                </span>
              )}
            </div>

            {isDual ? (
              <button type="button" onClick={() => onFocusPane("development")}>
                ↗
              </button>
            ) : (
              <button type="button" onClick={onReturnToDual}>
                ↙
              </button>
            )}
          </div>

          <div
            className="pane-body"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
            }}
          >
            {developmentBody}
          </div>
        </div>
      )}
    </div>
  );
}
