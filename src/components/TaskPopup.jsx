/* ======================================================================
   METRA – TaskPopup.jsx
   Stage 17.3.3 — Notes Immutability Enforcement (Read-Only)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Unified task popup
   ✔ Permission-gated writing (Stage 17.3.2)
   ✔ Append-only notes with hard immutability (Stage 17.3.3)
   ----------------------------------------------------------------------
   ENFORCED RULES (LOCKED):
   • Historical notes are permanently read-only
   • Editing allowed only in draft region
   • Notes remain append-only under all conditions
   ====================================================================== */

import React, { useState, useEffect, useRef } from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({ task, pane, onClose, onUpdate }) {
  if (!task) return null;

  /* -------------------------------------------------------------------
     Identity (TEMPORARY — Stage 17)
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
     Lifecycle states
  ------------------------------------------------------------------- */
  const isArchived = Boolean(task.archived);
  const isAssigned =
    Boolean(task.assigned && String(task.assigned).trim() !== "") ||
    Boolean(task.person && String(task.person).trim() !== "");

  /* -------------------------------------------------------------------
     Authority helpers (Stage 17.2)
  ------------------------------------------------------------------- */
  const getPmAuthorityId = () => task.pmId || task.creatorId || null;

  const isPmAuthority = () => {
    const pmId = getPmAuthorityId();
    return Boolean(pmId && currentUserId && pmId === currentUserId);
  };

  const isAssignedUser = () => {
    if (!currentUserId) return false;
    if (task.assignedId && task.assignedId === currentUserId) return true;
    if (task.assigned && task.assigned === currentUserId) return true;
    if (task.person && task.person === currentUserId) return true;
    return false;
  };

  // Admin delegate hook (NOT WIRED YET)
  const isAdminDelegate = false;

  /* -------------------------------------------------------------------
     WRITE PERMISSION (Stage 17.3.2)
  ------------------------------------------------------------------- */
  const canWrite =
    Boolean(currentUserId) &&
    !isArchived &&
    isAssigned &&
    (isPmAuthority() || isAssignedUser() || isAdminDelegate);

  /* -------------------------------------------------------------------
     Notes helpers
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

  /* -------------------------------------------------------------------
     Delete confirmation state
  ------------------------------------------------------------------- */
  const [confirmArchive, setConfirmArchive] = useState(false);

  /* -------------------------------------------------------------------
     Compute immutable boundary
  ------------------------------------------------------------------- */
  const boundary =
    historyText.length + (historyText ? 2 : 0); // account for separator

  /* -------------------------------------------------------------------
     Merge history + draft (with cursor enforcement)
  ------------------------------------------------------------------- */
  useEffect(() => {
    const merged = historyText + (historyText ? "\n\n" : "") + draftText;
    setVisibleText(merged);

    // Force cursor to remain in draft region
    setTimeout(() => {
      if (areaRef.current) {
        const pos = Math.max(boundary, areaRef.current.selectionStart || 0);
        areaRef.current.selectionStart = pos;
        areaRef.current.selectionEnd = pos;
      }
    }, 0);
  }, [historyText, draftText, boundary]);

  /* -------------------------------------------------------------------
     Typing handler (IMMUTABILITY ENFORCED)
  ------------------------------------------------------------------- */
  const handleChange = (e) => {
    if (!canWrite) return;

    const value = e.target.value;

    // Hard guard: history must be identical
    if (value.slice(0, boundary) !== visibleText.slice(0, boundary)) {
      return; // reject mutation of historical notes
    }

    const newDraft = value.slice(boundary);
    setDraftText(newDraft);
  };

  /* -------------------------------------------------------------------
     Timestamp helper
  ------------------------------------------------------------------- */
  const makeTimestamp = () => {
    const t = new Date();
    const dd = String(t.getDate()).padStart(2, "0");
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const yyyy = t.getFullYear();
    const HH = String(t.getHours()).padStart(2, "0");
    const MM = String(t.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${HH}:${MM}`;
  };

  /* -------------------------------------------------------------------
     Commit note entry (IMMUTABLE HISTORY)
  ------------------------------------------------------------------- */
  const commitEntry = async () => {
    if (!canWrite) return null;

    const trimmed = draftText.trim();
    if (trimmed === "") return null;

    const stamp = makeTimestamp();
    const entry = `${trimmed} – ${stamp}`;

    const updatedHistory =
      historyText ? `${historyText}\n\n${entry}` : entry;

    onUpdate({
      notes: updatedHistory + "\n\n",
      notesTimestamp: Date.now(),
      pane
    });

    setDraftText("");
    return entry;
  };

  /* -------------------------------------------------------------------
     Archive handler (unchanged)
  ------------------------------------------------------------------- */
  const handleArchive = async () => {
    if (!isPmAuthority()) return;

    if (!confirmArchive) {
      setConfirmArchive(true);
      return;
    }

    const stamp = makeTimestamp();
    const systemNote = `[System] Task archived – ${stamp}`;
    const updatedHistory =
      historyText ? `${historyText}\n\n${systemNote}` : systemNote;

    onUpdate({
      archived: true,
      notes: updatedHistory + "\n\n",
      notesTimestamp: Date.now(),
      pane
    });

    onClose();
  };

  /* -------------------------------------------------------------------
     Close handler
  ------------------------------------------------------------------- */
  const handleClose = async () => {
    await commitEntry();
    onClose();
  };

  /* ====================================================================
     RENDER
     ==================================================================== */
  return (
    <div
      className="taskpopup-overlay"
      onClick={() => setConfirmArchive(false)}
    >
      <div
        className="taskpopup-window"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="tp-header">
          <h3>{task.title}</h3>
          {isArchived && (
            <span style={{ color: "#888", fontSize: "0.85rem" }}>
              (Archived)
            </span>
          )}
        </div>

        {/* BODY */}
        <div className="tp-body">
          <h4>Notes</h4>
          <textarea
            ref={areaRef}
            className="tp-note-draft"
            value={visibleText}
            onChange={handleChange}
            readOnly={!canWrite}
          />
        </div>

        {/* CONFIRMATION TOAST */}
        {confirmArchive && (
          <div
            style={{
              margin: "10px 20px",
              padding: "10px 14px",
              background: "#fff3cd",
              borderLeft: "4px solid #856404",
              borderRadius: "6px",
              color: "#856404",
              fontSize: "0.9rem",
              lineHeight: "1.3",
              textAlign: "center",
              cursor: "pointer"
            }}
          >
            This will archive the task.
            <br />
            This action cannot be undone.
            <br />
            Click Delete again to confirm.
          </div>
        )}

        {/* FOOTER */}
        <div className="tp-footer">
          {!isArchived && (
            <button className="tp-delete" onClick={handleArchive}>
              Delete
            </button>
          )}
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
