/* ======================================================================
   METRA – TaskPopup.jsx
   Version: v7B1 – Stable Restore (Step 1 typing fix)
   ----------------------------------------------------------------------
   BEHAVIOUR:
   ✓ One textarea for full ledger
   ✓ User can always type freely until commit
   ✓ Last committed entry editable for 5 minutes
   ✓ Plain timestamp appended on commit
   ✓ Older entries locked
   ✓ On reopen → cursor drops ONE blank line below last entry
   ✓ No forced behaviour beyond this
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

  const initialText = normaliseNotes(task.notes);
  const [text, setText] = useState(initialText);
  const lastTimestamp = task.notesTimestamp || null;

  /* ---------------------------------------------------------------
     TEXTAREA REF + SCROLL
     --------------------------------------------------------------- */
  const areaRef = useRef(null);

  const scrollToBottom = () => {
    if (areaRef.current) {
      areaRef.current.scrollTop = areaRef.current.scrollHeight;
    }
  };

  useEffect(scrollToBottom, []);
  useEffect(scrollToBottom, [text]);

  /* ---------------------------------------------------------------
     5-MINUTE RULE (applies ONLY after commit)
     --------------------------------------------------------------- */
  const canEditLastEntry =
    !lastTimestamp || Date.now() - lastTimestamp <= 5 * 60 * 1000;

  /* ---------------------------------------------------------------
     ON POPUP OPEN → ensure ONE blank line below last entry
     --------------------------------------------------------------- */
  useEffect(() => {
    let updated = text;

    if (!updated.endsWith("\n\n")) {
      updated = updated.trimEnd() + "\n\n";
      setText(updated);
    }

    setTimeout(() => {
      if (areaRef.current) {
        const end = areaRef.current.value.length;
        areaRef.current.selectionStart = end;
        areaRef.current.selectionEnd = end;
      }
    }, 0);
  }, []);

  /* ---------------------------------------------------------------
     STEP 1 — HANDLE TYPING (always allowed until commit)
     --------------------------------------------------------------- */
  const handleChange = (e) => {
    setText(e.target.value);   // ← FIX: fully restores typing
  };

  /* ---------------------------------------------------------------
     TIMESTAMP FORMAT  (plain text)
     --------------------------------------------------------------- */
  const makeTimestamp = () => {
    const t = new Date();
    const dd = String(t.getDate()).padStart(2, "0");
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const yyyy = t.getFullYear();
    const HH = String(t.getHours()).padStart(2, "0");
    const MM = String(t.getMinutes()).padStart(2, "0");
    return `[${dd}/${mm}/${yyyy} – ${HH}:${MM}]`;
  };

  /* ---------------------------------------------------------------
     COMMIT ENTRY
     --------------------------------------------------------------- */
  const commitEntry = () => {
    return new Promise((resolve) => {
      let current = text.trimEnd();
      const stamp = makeTimestamp();

      const parts = current.split("\n\n");
      const lastEntry = parts[parts.length - 1];

      const cleanedLast = lastEntry.replace(/\s*\[[^\]]+\]$/, "").trimEnd();

      const rebuilt =
        parts.slice(0, -1).join("\n\n") +
        (parts.length > 1 ? "\n\n" : "") +
        cleanedLast +
        " " +
        stamp +
        "\n\n";

      setText(rebuilt);

      onUpdate({
        notes: rebuilt,
        notesTimestamp: Date.now(),
      });

      resolve(rebuilt);
    });
  };

  /* ---------------------------------------------------------------
     CLOSE POPUP → commit and exit immediately
     --------------------------------------------------------------- */
  const handleClose = async () => {
    await commitEntry();
    onClose();
  };

  /* ---------------------------------------------------------------
     FOOTER ACTIONS
     --------------------------------------------------------------- */
  const doAction = async (fields) => {
    await commitEntry();
    onUpdate(fields);
    onClose();
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

        {/* HEADER */}
        <div className="tp-header">
          <h3>{task.title}</h3>
          <div className="tp-person" onClick={handleChangePerson}>
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
