/* ======================================================================
   METRA – TaskPopup.jsx
   v17 – Absolute History Protection (A1) + True Merge (V1) + D1 Blank Draft
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ One visible textarea (unchanged look)
   ✔ History read-only: cursor cannot enter upper zone
   ✔ Draft zone always empty on open
   ✔ True merge: history + draft shown together
   ✔ Commit only if draft has text
   ✔ Timestamp on same line as entry
   ✔ 1-second close delay
   ====================================================================== */

import React, { useState, useEffect, useRef } from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({ task, onClose, onUpdate }) {
  if (!task) return null;

  /* ---------------------------------------------------------------
     NORMALISE HISTORY (stored notes)
     --------------------------------------------------------------- */
  const normaliseNotes = (v) => {
    if (typeof v === "string") return v;
    if (!v) return "";
    if (Array.isArray(v)) return v.join("\n");
    return String(v);
  };

  const historyText = normaliseNotes(task.notes).trimEnd();

  /* D1: Draft always empty on open */
  const [draftText, setDraftText] = useState("");

  /* Unified visible text (history + draft) */
  const [visibleText, setVisibleText] = useState("");
  const areaRef = useRef(null);

  /* ---------------------------------------------------------------
     RENDER MERGED TEXT ON OPEN
     --------------------------------------------------------------- */
  useEffect(() => {
    // Always render history + 2 newlines + empty draft
    const merged = historyText + (historyText ? "\n\n" : "") + draftText;

    setVisibleText(merged);

    // place cursor after history
    setTimeout(() => {
      if (areaRef.current) {
        const boundary = historyText.length + (historyText ? 2 : 0); 
        areaRef.current.selectionStart = boundary;
        areaRef.current.selectionEnd = boundary;
      }
    }, 0);
  }, [historyText]);

  /* ---------------------------------------------------------------
     ON TYPING – allow changes only to draft region
     --------------------------------------------------------------- */
  const handleChange = (e) => {
    const newValue = e.target.value;

    const boundary = historyText.length + (historyText ? 2 : 0);

    // Extract draft portion only (text after boundary)
    const newDraft = newValue.slice(boundary);

    setDraftText(newDraft);
    setVisibleText(historyText + (historyText ? "\n\n" : "") + newDraft);

    // Force cursor to stay in draft area
    setTimeout(() => {
      if (areaRef.current) {
        if (areaRef.current.selectionStart < boundary) {
          areaRef.current.selectionStart = boundary;
          areaRef.current.selectionEnd = boundary;
        }
      }
    }, 0);
  };

  /* ---------------------------------------------------------------
     TIMESTAMP MAKER
     --------------------------------------------------------------- */
  const makeTimestamp = () => {
    const t = new Date();
    const dd = String(t.getDate()).padStart(2, "0");
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const yyyy = t.getFullYear();
    const HH = String(t.getHours()).padStart(2, "0");
    const MM = String(t.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${HH}:${MM}`;
  };

  /* ---------------------------------------------------------------
     COMMIT ENTRY (only if draft contains text)
     --------------------------------------------------------------- */
  const commitEntry = () => {
    return new Promise((resolve) => {
      const trimmed = draftText.trim();

      if (trimmed === "") {
        resolve(null); // nothing to commit
        return;
      }

      const stamp = makeTimestamp();
      const entry = `${trimmed} – ${stamp}`;

      const updatedHistory = 
        historyText 
        ? `${historyText}\n\n${entry}` 
        : entry;

      onUpdate({
        notes: updatedHistory + "\n\n",
        notesTimestamp: Date.now(),
      });

      resolve(entry);
    });
  };

  /* ---------------------------------------------------------------
     CLOSE POPUP (always with 1-second delay)
     --------------------------------------------------------------- */
  const handleClose = async () => {
    await commitEntry();

    setTimeout(() => {
      onClose();
    }, 1000);
  };

  /* Footer actions (force commit) */
  const doAction = async (fields) => {
    await commitEntry();
    onUpdate(fields);
    setTimeout(() => onClose(), 1000);
  };

  const handleChangePerson = () => {
    doAction({ changePerson: true });
  };

  /* ---------------------------------------------------------------
     RENDER
     --------------------------------------------------------------- */
  return (
    <div className="taskpopup-overlay">
      <div className="taskpopup-window">

        <div className="tp-header">
          <h3>{task.title}</h3>
          <div className="tp-person" onClick={handleChangePerson}>
            {task.person || "Assign Person"}
          </div>
          <button className="tp-close-btn" onClick={handleClose}>✕</button>
        </div>

        <div className="tp-body">
          <h4>Notes</h4>

          <textarea
            ref={areaRef}
            className="tp-note-draft"
            value={visibleText}
            onChange={handleChange}
          />
        </div>

        <div className="tp-footer">
          <div className="tp-gov-row">
            <button onClick={() => doAction({ gov: "CC" })}>CC</button>
            <button onClick={() => doAction({ gov: "QC" })}>QC</button>
            <button onClick={() => doAction({ gov: "Risk" })}>Risk</button>
            <button onClick={() => doAction({ gov: "Issue" })}>Issue</button>
            <button onClick={() => doAction({ gov: "Escalate" })}>Escalate</button>
            <button onClick={() => doAction({ gov: "Email" })}>Email</button>
            <button onClick={() => doAction({ gov: "Docs" })}>Docs</button>
            <button onClick={() => doAction({ gov: "Template" })}>Template</button>
          </div>

          <div className="tp-action-row">
            <button onClick={handleChangePerson}>Change Person</button>
            <button onClick={() => doAction({ status: "Completed" })}>
              Mark Completed
            </button>
            <button className="tp-delete" onClick={() => doAction({ delete: true })}>
              Delete
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
