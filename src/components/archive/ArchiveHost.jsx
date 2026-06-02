// @ts-nocheck
/*
=====================================================================
METRA — ArchiveHost.jsx
=====================================================================

Stage 364 — Archive Surface
Stage 366 — Structural Inspection Support

PURPOSE
---------------------------------------------------------------------
Archive module surface host.

• Hosts archived segment list
• Hosts archive viewer
• Read-only inspection only
• No mutation
=====================================================================
*/

import { useMemo, useState } from "react";
import ArchivedSegmentList from "./ArchivedSegmentList";
import ArchiveViewer from "./ArchiveViewer";

export default function ArchiveHost({
  segments = [],
  summaries = [],
  tasks = [],
  onClose = () => {},
  onInspectSegment = () => {},
  canInspect = true
}) {

  const archivedSegments = useMemo(
    () => (segments || []).filter((s) => !!s.archived),
    [segments]
  );

  const [selectedSegmentId, setSelectedSegmentId] = useState(
    archivedSegments[0]?.segmentId ?? null
  );

  const selected = useMemo(
    () =>
      archivedSegments.find((s) => s.segmentId === selectedSegmentId) || null,
    [archivedSegments, selectedSegmentId]
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.25)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "min(1000px, 96vw)",
          height: "min(640px, 90vh)",
          background: "#fff",
          borderRadius: "10px",
          border: "1px solid #ddd",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "10px 12px",
            borderBottom: "1px solid #eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontWeight: "800" }}>Archive</div>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: "1px solid #ddd",
              background: "#fff",
              borderRadius: "8px",
              padding: "6px 10px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            Close
          </button>
        </div>

        <div style={{ flex: 1, display: "flex" }}>
          <ArchivedSegmentList
            archivedSegments={archivedSegments}
            selectedSegmentId={selectedSegmentId}
            onSelect={(id) => setSelectedSegmentId(id)}
            onInspect={onInspectSegment}
            canInspect={canInspect}
          />

          <ArchiveViewer
            segment={selected}
            summaries={summaries}
            tasks={tasks}
          />
        </div>
      </div>
    </div>
  );
}
