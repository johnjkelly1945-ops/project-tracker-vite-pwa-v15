/* ======================================================================
   METRA – TaskPopup.jsx
   Version: v15.9 – Last Fully Stable Logic Before Styling
   ----------------------------------------------------------------------
   RULES:
   ✔ Old entries permanently locked
   ✔ Only draft zone (bottom) is editable
   ✔ Commit ONLY if draft has real text
   ✔ No timestamp duplication
   ✔ No invisible commits
   ✔ On close → commit then close after 2 seconds
   ✔ On reopen → cursor moves to draft zone
   ====================================================================== */

import React, { useState, useEffect, useRef } from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({ task, onClose, onUpdate }) {
  if (!task) return null;

  /* ---------------------------------------------------------------
     NORMALISE NOTES
     --------------------------------------------------------------- */
  const normaliseNotes = (v) => {
    if (typeof v === "string") return v;
    if (v === null || v === undefined) return "";
    if (Array.isArray(v)) return v.join("\n\n");
    return String(v);
  };

  const initialNotes = normaliseNotes(task.notes);
  const [text, setText] = useState(initialNotes);
  const areaRef = useRef(null);

  /* ---------------------------------------------------------------
     FIND START OF DRAFT ZONE
     --------------------------------------------------------------- */
  const findDraftStart = (input) => {
    const idx = input.lastIndexOf("\n\n");
    if (idx === -1) return 0;
    return idx + 2;
  };

  /* ---------------------------------------------------------------
     TYPING HANDLER – Prevent editing old entries
     --------------------------------------------------------------- */
  const handleChange = (e) => {
    const newVal = e.target.value;
    if (!areaRef.current) return;

    const cursor = areaRef.current.selectionStart;
    const draftStart = findDraftStart(text);

    if (cursor < draftStart) {
      areaRef.current.value = text;
      return;
    }

    setText(newVal);
  };

  /* ---------------------------------------------------------------
     POSITION CURSOR IN DRAFT ON OPEN
     --------------------------------------------------------------- */
  useEffect(() => {
    if (!areaRef.current) return;

    const draftStart = findDraftStart(text);

    areaRef.current.selectionStart = draftStart;
    areaRef.current.selectionEnd = draftStart;

    areaRef.current.scrollTop = areaRef.current.scrollHeight;
  }, []);

  /* ---------------------------------------------------------------
     SCROLL TO BOTTOM ON TEXT CHANGE
     --------------------------------------------------------------- */
  useEffect(() => {
    if (areaRef.current) {
      areaRef.current.scrollTop = areaRef.current.scrollHeight;
    }
  }, [text]);

  /* ---------------------------------------------------------------
     TIMESTAMP FORMAT
     --------------------------------------------------------------- */
  const makeTimestamp = () => {
    const t = new Date();
    const dd = String(t.getDate()).padStart(2, "0");
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const yyyy = t.getFullYear();
    const HH = String(t.getHours()).padStart(2, "0");
    const MM = String(t.getMinutes()).padStart(2, "0");
    return ` – ${dd}/${mm}/${yyyy} ${HH}:${MM}`;
  };

  /* ---------------------------------------------------------------
     CHECK IF DRAFT HAS REAL TEXT
     --------------------------------------------------------------- */
  const draftHasRealText = () => {
    const draftStart = findDraftStart(text);
    const draft = text.slice(draftStart);
    return draft.trim().length > 0;
  };

  /* ---------------------------------------------------------------
     COMMIT ENTRY
     --------------------------------------------------------------- */
  const commitEntry = () => {
    return new Promise((resolve) => {
      if (!draftHasRealText()) {
        resolve(false);
        return;
      }

      let newText = text.trimEnd();
      newText = newText + makeTimestamp();
      newText = newText + "\n\n\n";   // add blank line + new draft

      setText(newText);

      onUpdate({
        notes: newText,
        notesTimestamp: Date.now(),
      });

      resolve(true);
    });
  };

  /* ---------------------------------------------------------------
     CLOSE POPUP
     --------------------------------------------------------------- */
  const handleClose = async () => {
    await commitEntry();
    setTimeout(() => onClose(), 2000);
  };

  /* ---------------------------------------------------------------
     FOOTER ACTIONS
     --------------------------------------------------------------- */
  const doAction = async (fields) => {
    await commitEntry();
    onUpdate(fields);
    setTimeout(() => onClose(), 2000);
  };

  return (
    <div className="taskpopup-overlay">
      <div className="taskpopup-window">

        <div className="tp-header">
          <h3>{task.title}</h3>

          <div
            className="tp-person"
            onClick={() => doAction({ changePerson: true })}
          >
            {task.person || "Assign Person"}
          </div>

          <button className="tp-close-btn" onClick={handleClose}>✕</button>
        </div>

        <div className="tp-body">
          <h4>Notes</h4>
          <textarea
            ref={areaRef}
            className="tp-note-draft"
            value={text}
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
            <button onClick={() => doAction({ changePerson: true })}>
              Change Person
            </button>
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
