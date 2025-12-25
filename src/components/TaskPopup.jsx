/* ======================================================================
   METRA – TaskPopup.jsx
   v8.1 – Notes Permission Enforcement (Stage 15.2)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Unified task popup
   ✔ Append-only notes
   ✔ Stage 15.2: Notes require assignment
   ----------------------------------------------------------------------
   STAGE 15.2 RULE (LOCKED):
   • Notes may only be added when a task is assigned
   • Enforcement occurs at commit boundary (not UI-only)
   • No UI redesign
   ====================================================================== */

import React, { useState, useEffect, useRef } from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({ task, pane, onClose, onUpdate }) {
  if (!task) return null;

  /* -------------------------------------------------------------------
     Assignment state (authoritative)
     Notes require assignment (Stage 15.2)
  ------------------------------------------------------------------- */
  const isAssigned =
    Boolean(task.assigned && task.assigned.trim() !== "") ||
    Boolean(task.person && task.person.trim() !== "");

  /* -------------------------------------------------------------------
     Normalise notes into text
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
     Merge history + draft
  ------------------------------------------------------------------- */
  useEffect(() => {
    const merged = historyText + (historyText ? "\n\n" : "") + draftText;
    setVisibleText(merged);

    setTimeout(() => {
      if (areaRef.current) {
        const boundary = historyText.length + (historyText ? 2 : 0);
        areaRef.current.selectionStart = boundary;
        areaRef.current.selectionEnd = boundary;
      }
    }, 0);
  }, [historyText]);

  /* -------------------------------------------------------------------
     Typing handler
     (UI still blocks typing when unassigned)
  ------------------------------------------------------------------- */
  const handleChange = (e) => {
    if (!isAssigned) return;

    const newValue = e.target.value;
    const boundary = historyText.length + (historyText ? 2 : 0);
    const newDraft = newValue.slice(boundary);

    setDraftText(newDraft);
    setVisibleText(historyText + (historyText ? "\n\n" : "") + newDraft);
  };

  /* -------------------------------------------------------------------
     Timestamp
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
     Commit entry (AUTHORITATIVE ENFORCEMENT POINT)
     Stage 15.2: Notes require assignment
  ------------------------------------------------------------------- */
  const commitEntry = async () => {
    // 🔒 Stage 15.2 enforcement
    if (!isAssigned) return null;

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

    return entry;
  };

  /* -------------------------------------------------------------------
     Close
  ------------------------------------------------------------------- */
  const handleClose = async () => {
    await commitEntry();
    onClose();
  };

  /* ====================================================================
     RENDER
     ==================================================================== */
  return (
    <div className="taskpopup-overlay">
      <div className="taskpopup-window">
        <div className="tp-header">
          <h3>{task.title}</h3>
        </div>

        <div className="tp-body">
          <h4>Notes</h4>
          <textarea
            ref={areaRef}
            className="tp-note-draft"
            value={visibleText}
            onChange={handleChange}
            readOnly={!isAssigned}
          />
        </div>

        <div className="tp-footer">
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
