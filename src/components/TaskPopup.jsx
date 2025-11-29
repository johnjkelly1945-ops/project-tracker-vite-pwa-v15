/* ======================================================================
   METRA – TaskPopup.jsx
   Version: v16 – Immutable Log + No-False-Commit Edition
   ----------------------------------------------------------------------
   RULES:
   ✔ Old entries permanently locked
   ✔ Only draft zone (bottom) is editable
   ✔ Commit ONLY if draft contains real text (non-whitespace)
   ✔ No timestamp spam
   ✔ No commit if blank draft
   ✔ Commit = freeze entry forever + add timestamp + add blank draft area
   ✔ Cursor automatically goes to draft zone
   ====================================================================== */

import React, { useState, useEffect, useRef } from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({ task, onClose, onUpdate }) {
  if (!task) return null;

  /* ---------------------------------------------------------------
     INITIAL CONTENT
     --------------------------------------------------------------- */
  const initialNotes =
    typeof task.notes === "string"
      ? task.notes
      : task.notes
      ? String(task.notes)
      : "";

  const [text, setText] = useState(initialNotes);
  const areaRef = useRef(null);

  /* ---------------------------------------------------------------
     FIND START OF DRAFT ENTRY
     (editable region begins after the last double newline)
     --------------------------------------------------------------- */
  const findDraftStart = (input) => {
    const idx = input.lastIndexOf("\n\n");
    if (idx === -1) return 0;
    return idx + 2;
  };

  /* ---------------------------------------------------------------
     HANDLE USER TYPING – only allow edits in draft zone
     --------------------------------------------------------------- */
  const handleChange = (e) => {
    const newVal = e.target.value;
    if (!areaRef.current) return;

    const cursor = areaRef.current.selectionStart;
    const draftStart = findDraftStart(text);

    // Block edits in locked region
    if (cursor < draftStart) {
      areaRef.current.value = text; // restore previous text
      return;
    }

    setText(newVal);
  };

  /* ---------------------------------------------------------------
     POSITION CURSOR IN DRAFT ZONE ON OPEN
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
     TIMESTAMP FORMATTER
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
     CHECK IF DRAFT CONTAINS REAL TEXT
     (returns true only if letters/numbers/punctuation exist)
     --------------------------------------------------------------- */
  const draftHasRealText = () => {
    const draftStart = findDraftStart(text);
    const draft = text.slice(draftStart);

    // Strip whitespace (spaces, tabs, blank lines)
    return draft.trim().length > 0;
  };

  /* ---------------------------------------------------------------
     COMMIT ENTRY (only if draft contains real text)
     --------------------------------------------------------------- */
  const commitEntry = () => {
    return new Promise((resolve) => {
      // If no real text, do NOT commit anything
      if (!draftHasRealText()) {
        resolve(false); // no commit performed
        return;
      }

      let newText = text.trimEnd();

      // Append timestamp
      newText = newText + makeTimestamp();

      // Add two newlines for next draft entry
      newText = newText + "\n\n\n";

      setText(newText);

      onUpdate({
        notes: newText,
        notesTimestamp: Date.now(),
      });

      resolve(true); // commit performed
    });
  };

  /* ---------------------------------------------------------------
     CLOSE POPUP (ONLY commit if real text exists)
     --------------------------------------------------------------- */
  const handleClose = async () => {
    const didCommit = await commitEntry();

    // Whether committed or not, close after 2s
    setTimeout(() => onClose(), 2000);
  };

  /* ---------------------------------------------------------------
     FOOTER ACTIONS – always commit first if draft has real text
     --------------------------------------------------------------- */
  const doAction = async (fields) => {
    const didCommit = await commitEntry();

    onUpdate(fields);

    setTimeout(() => onClose(), 2000);
  };

  /* ---------------------------------------------------------------
     RENDER
     --------------------------------------------------------------- */
  return (
    <div className="taskpopup-overlay">
      <div className="taskpopup-window">

        {/* HEADER */}
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

        {/* NOTES */}
        <div className="tp-body">
          <h4>Notes</h4>
          <textarea
            ref={areaRef}
            className="tp-note-draft"
            value={text}
            onChange={handleChange}
          />
        </div>

        {/* FOOTER */}
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
            <button onClick={() => doAction({ delete: true })} className="tp-delete">
              Delete
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
