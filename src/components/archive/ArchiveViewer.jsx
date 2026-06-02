import { useState } from "react";
// @ts-nocheck
/*
=====================================================================
METRA — ArchiveViewer.jsx
=====================================================================

Stage 364 — Viewer Foundation
Stage 366 — Structural Inspection (Read-Only)
Stage 367 — Dual-Pane Archive Mirror
Stage 368 — Archived Task Inspection + Archive Search

PURPOSE
---------------------------------------------------------------------
Inspect archived segment structure.

• Projection only
• No mutation
• Mirrors workspace dual-pane structure
• Read-only inspection of summaries and tasks
=====================================================================
*/


function fmtDateTime(ts) {
  if (!ts) return "—";
  try {
    return new Date(ts).toISOString().replace("T", " ").slice(0, 19);
  } catch {
    return "—";
  }
}


export default function ArchiveViewer({
  segment
}) {


  if (!segment) {
    return (
      <div style={{ padding: "12px", width: "60%" }}>
        <div style={{ opacity: 0.7 }}>
          Select an archived segment to inspect.
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "60%", height: "100%" }}>

      <div style={{ padding: "12px", fontWeight: "700" }}>
        Archive Viewer
      </div>


        <div style={{ padding: "0 12px 12px", fontSize: "13px" }}>

          <div>
            <strong>Segment Title:</strong> {segment.segmentTitle || "—"}
          </div>

          <div style={{ marginTop: "6px" }}>
            <strong>Segment Type:</strong> {segment.segmentType || "—"}
          </div>

          <div style={{ marginTop: "12px" }}>
            <strong>Owner:</strong> {segment.ownerName || "Not assigned"}
          </div>

          <div style={{ marginTop: "6px" }}>
            <strong>
              {segment.segmentType === "SEED" ? "Originator:" : "PM:"}
            </strong>{" "}
            {segment.pmName || "Not assigned"}
          </div>

          <div style={{ marginTop: "6px" }}>
            <strong>Authorised By:</strong>{" "}
            {segment.authorisedBy || "Not recorded"}
          </div>

          <div style={{ marginTop: "6px" }}>
            <strong>Authorised At:</strong>{" "}
            {fmtDateTime(segment.authorisedAt)}
          </div>

          <div style={{ marginTop: "6px" }}>
            <strong>Created:</strong>{" "}
            {fmtDateTime(segment.createdAt)}
          </div>

          <div style={{ marginTop: "6px" }}>
            <strong>Archived:</strong>{" "}
            {fmtDateTime(segment.archivedAt)}
          </div>

          {segment.segmentType === "SEED" && (
            <>
              <div style={{ marginTop: "12px" }}>
                <strong>Description:</strong>
              </div>

              <div style={{ marginTop: "4px" }}>
                {segment.description || "—"}
              </div>

              <div style={{ marginTop: "12px" }}>
                <strong>Outcome:</strong>
              </div>

              <div style={{ marginTop: "4px" }}>
                {segment.outcome || "—"}
              </div>
            </>
          )}

        </div>

        <div
          style={{
            margin: "0 12px 12px",
            padding: "10px",
            border: "1px solid #e5e5e5",
            borderRadius: "6px",
            fontSize: "13px",
            opacity: 0.8,
          }}
        >
          Archived operational history is available through Inspect.
          Archive provides contextual information only.
        </div>

    </div>
  );
}
