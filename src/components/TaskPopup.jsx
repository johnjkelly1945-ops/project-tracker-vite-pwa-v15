/* ======================================================================
   METRA – TaskPopup.jsx
   v7 A5 – Final Notes Engine (Append-only + Timestamp + Cursor Lock)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ One textarea, full ledger
   ✔ Append-only model
   ✔ Timestamp added AFTER entry
   ✔ Blank line between entries
   ✔ Auto-scroll to bottom
   ✔ Cursor always returns to bottom
   ✔ User may scroll + copy from old entries
   ✔ Older entries read-only
   ✔ Latest entry editable for 5 minutes
   ====================================================================== */

import React, { useState, useEffect, useRef } from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({ task, onClose, onUpdate }) {
  if (!task) return null;

  /* ============================================================
     NOTES LEDGER TEXT (single string)
     ============================================================ */
  const initialText = task.notes || "";
  const [text, setText] = useState(initialText);

  // Timestamp of most recent committed note
  const lastTimestamp = task.notesTimestamp || null;

  /* ============================================================
     5-MINUTE RULE
     Only newest entry (bottom) is editable for 5 minutes.
     ============================================================ */
  const canEdit =
    !lastTimestamp || Date.now() - lastTimestamp <= 5 * 60 * 1000;

  /* ============================================================
     TEXTAREA REF (for auto-scroll + cursor positioning)
     ============================================================ */
  const areaRef = useRef(null);

  // Always scroll to bottom when popup opens or text changes
  const scrollToBottom = () => {
    if (areaRef.current) {
      areaRef.current.scrollTop = areaRef.current.scrollHeight;
    }
  };

  useEffect(scrollToBottom, []);
  useEffect(scrollToBottom, [text]);


  /* ============================================================
     CURSOR ENFORCEMENT
     Prevents cursor entering locked (old) text.
     ============================================================ */
  const forceCursorToEnd = () => {
    if (areaRef.current) {
      const end = areaRef.current.value.length;
      areaRef.current.selectionStart = end;
      areaRef.current.selectionEnd = end;
    }
  };

  // On focus → always move cursor to bottom
  const handleFocus = () => {
    forceCursorToEnd();
  };

  // On click → if user clicks inside old text, jump cursor to bottom
  const handleClick = () => {
    if (!canEdit) {
      forceCursorToEnd();
      return;
    }
    if (areaRef.current) {
      const pos = areaRef.current.selectionStart;
      const readOnlyUpTo = initialText.length;

      if (pos < readOnlyUpTo) {
        forceCursorToEnd();
      }
    }
  };


  /* ============================================================
     CAPTURE NEW TYPING
     Only allowed after the previous commit and within 5 min.
     ============================================================ */
  const handleChange = (e) => {
    if (!canEdit) {
      // revert cursor
      forceCursorToEnd();
      return;
    }

    // prevent edits in the old region
    const newValue = e.target.value;
    const oldLen = initialText.length;

    if (newValue.length < oldLen) {
      // user tried to backspace/delete inside old text
      forceCursorToEnd();
      return;
    }

    // enforce append-only typing
    if (areaRef.current.selectionStart < oldLen) {
      forceCursorToEnd();
      return;
    }

    setText(newValue);
  };


  /* ============================================================
     COMMIT ENTRY
     Adds timestamp after the newly typed text.
     ============================================================ */
  const commitEntry = () => {
    const oldLen = initialText.length;
    const newSegment = text.slice(oldLen).trim();

    if (newSegment === "") return;

    // create timestamp
    const timestamp = Date.now();
    const timeStr = new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Append timestamp on SAME LINE + blank line
    const committed =
      text.trimEnd() + `    (${timeStr})\n\n`;

    setText(committed);

    // Push update upstream
    onUpdate({
      notes: committed,
      notesTimestamp: timestamp,
    });
  };


  /* ============================================================
     CLOSING THE POPUP
     ============================================================ */
  const handleClose = () => {
    commitEntry();
    onClose();
  };


  /* ============================================================
     BUTTON ACTIONS
     ============================================================ */
  const doAction = (fields) => {
    commitEntry();
    onUpdate(fields);
  };

  const handleChangePerson = () => {
    commitEntry();
    doAction({ changePerson: true });
  };


  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <div className="taskpopup-overlay">
      <div className="taskpopup-window">

        {/* HEADER */}
        <div className="tp-header">
          <h3>{task.title}</h3>

          <div className="tp-person" onClick={handleChangePerson}>
            {task.person || "Assign Person"}
          </div>

          <button className="tp-close-btn" onClick={handleClose}>✕</button>
        </div>

        {/* NOTES LEDGER */}
        <div className="tp-body">
          <h4>Notes</h4>

          <textarea
            ref={areaRef}
            className="tp-note-draft"
            value={text}
            onChange={handleChange}
            onFocus={handleFocus}
            onClick={handleClick}
            readOnly={!canEdit}
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
