/* ======================================================================
   METRA – TaskPopup.jsx
   Stage 19.2 — VERIFIED (Activation & Editability)
   ----------------------------------------------------------------------
   ✔ Assignment inside popup (PM)
   ✔ Activation = assignment
   ✔ Notes editable only after activation
   ✔ Append-only notes immutability preserved
   ✔ NO presentation experiments
   ====================================================================== */

import React, { useState, useEffect, useRef } from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({ task, pane, onClose, onUpdate }) {
  if (!task) return null;

  /* -------------------------------------------------------------------
     Identity (Stage 17 carry-forward)
     ------------------------------------------------------------------- */
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser"));
    } catch {
      return null;
    }
  })();
  const currentUserId = currentUser?.id ?? null;

  /* -------------------------------------------------------------------
     Lifecycle
     ------------------------------------------------------------------- */
  const isAssigned =
    Boolean(task.assigned && String(task.assigned).trim()) ||
    Boolean(task.person && String(task.person).trim());

  /* -------------------------------------------------------------------
     Authority
     ------------------------------------------------------------------- */
  const getPmAuthorityId = () => task.pmId || task.creatorId || null;

  const isPmAuthority = () =>
    Boolean(currentUserId && getPmAuthorityId() === currentUserId);

  const isAssignedUser = () =>
    Boolean(
      currentUserId &&
      (task.assigned === currentUserId ||
        task.person === currentUserId ||
        task.assignedId === currentUserId)
    );

  const canWrite =
    Boolean(currentUserId) &&
    isAssigned &&
    (isPmAuthority() || isAssignedUser());

  /* -------------------------------------------------------------------
     Notes (IMMUTABLE — VERIFIED)
     ------------------------------------------------------------------- */
  const normaliseNotes = (v) => {
    if (typeof v === "string") return v;
    if (!v) return "";
    if (Array.isArray(v)) return v.join("\n");
    return String(v);
  };

  const historyText = normaliseNotes(task.notes).trimEnd();
  const [draftText, setDraftText] = useState("");
  const [visibleText, setVisibleText] = useState("");
  const areaRef = useRef(null);

  const boundary = historyText.length + (historyText ? 2 : 0);

  useEffect(() => {
    const merged = historyText + (historyText ? "\n\n" : "") + draftText;
    setVisibleText(merged);

    setTimeout(() => {
      if (areaRef.current) {
        const pos = Math.max(boundary, areaRef.current.selectionStart || 0);
        areaRef.current.selectionStart = pos;
        areaRef.current.selectionEnd = pos;
      }
    }, 0);
  }, [historyText, draftText, boundary]);

  const handleChange = (e) => {
    if (!canWrite) return;

    const value = e.target.value;
    if (value.slice(0, boundary) !== visibleText.slice(0, boundary)) return;

    setDraftText(value.slice(boundary));
  };

  const makeTimestamp = () => {
    const t = new Date();
    const dd = String(t.getDate()).padStart(2, "0");
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const yyyy = t.getFullYear();
    const HH = String(t.getHours()).padStart(2, "0");
    const MM = String(t.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${HH}:${MM}`;
  };

  const commitEntry = () => {
    if (!canWrite) return;

    const trimmed = draftText.trim();
    if (!trimmed) return;

    const entry = `${trimmed} – ${makeTimestamp()}`;
    const updated =
      historyText ? `${historyText}\n\n${entry}` : entry;

    onUpdate({
      notes: updated + "\n\n",
      notesTimestamp: Date.now(),
      pane
    });

    setDraftText("");
  };

  /* -------------------------------------------------------------------
     Assignment (PM → activates task)
     ------------------------------------------------------------------- */
  const [assignmentDraft, setAssignmentDraft] = useState(
    task.person || task.assigned || ""
  );

  const commitAssignment = () => {
    if (!isPmAuthority()) return;
    if (!assignmentDraft.trim()) return;

    const stamp = makeTimestamp();
    const systemNote = `[System] Person assigned (${assignmentDraft}) – ${stamp}`;
    const updated =
      historyText ? `${historyText}\n\n${systemNote}` : systemNote;

    onUpdate({
      person: assignmentDraft,
      assigned: assignmentDraft,
      notes: updated + "\n\n",
      notesTimestamp: Date.now(),
      pane
    });
  };

  const handleClose = () => {
    commitEntry();
    onClose();
  };

  return (
    <div className="taskpopup-overlay">
      <div className="taskpopup-window" onClick={(e) => e.stopPropagation()}>
        <div className="tp-header">
          <h3>{task.title}</h3>
        </div>

        <div className="tp-body">
          {!isAssigned && isPmAuthority() && (
            <div style={{ marginBottom: "10px" }}>
              <label>Assign person</label>
              <div style={{ display: "flex", gap: "6px" }}>
                <input
                  value={assignmentDraft}
                  onChange={(e) => setAssignmentDraft(e.target.value)}
                />
                <button onClick={commitAssignment}>Assign</button>
              </div>
            </div>
          )}

          <h4>Notes</h4>
          <textarea
            ref={areaRef}
            value={visibleText}
            onChange={handleChange}
            readOnly={!canWrite}
          />
        </div>

        <div className="tp-footer">
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
