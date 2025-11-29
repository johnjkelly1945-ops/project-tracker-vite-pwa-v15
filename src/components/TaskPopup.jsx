/* ======================================================================
   METRA – TaskPopup.jsx
   v18 – Stable Logic + Balanced Header (Left-Spacer Model)
   ====================================================================== */

import React, { useState, useEffect, useRef } from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({ task, onClose, onUpdate }) {
  if (!task) return null;

  /* ---------------------------------------------------------------
     LOCK MODE – task inactive until assigned
  --------------------------------------------------------------- */
  const isLocked = !task.person || task.person.trim() === "";

  /* ---------------------------------------------------------------
     NORMALISE HISTORY
  --------------------------------------------------------------- */
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

  /* ---------------------------------------------------------------
     RENDER MERGED TEXT ON OPEN
  --------------------------------------------------------------- */
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

  /* ---------------------------------------------------------------
     HANDLE TYPING – only in draft zone
  --------------------------------------------------------------- */
  const handleChange = (e) => {
    if (isLocked) return;

    const newValue = e.target.value;
    const boundary = historyText.length + (historyText ? 2 : 0);
    const newDraft = newValue.slice(boundary);

    setDraftText(newDraft);
    setVisibleText(historyText + (historyText ? "\n\n" : "") + newDraft);

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
     MAKE TIMESTAMP
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
     COMMIT ENTRY
  --------------------------------------------------------------- */
  const commitEntry = () => {
    return new Promise((resolve) => {
      if (isLocked) {
        resolve(null);
        return;
      }

      const trimmed = draftText.trim();
      if (trimmed === "") {
        resolve(null);
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
     CLOSE POPUP (normal close)
  --------------------------------------------------------------- */
  const handleClose = async () => {
    await commitEntry();
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  /* ---------------------------------------------------------------
     INSTANT CHANGE PERSON
  --------------------------------------------------------------- */
  const handleChangePerson = async () => {
    await commitEntry();
    onUpdate({ changePerson: true });
    onClose(); // instant close
  };

  /* ---------------------------------------------------------------
     FOOTER ACTION
  --------------------------------------------------------------- */
  const doAction = async (fields) => {
    if (!isLocked) {
      await commitEntry();
      onUpdate(fields);
    }
    setTimeout(() => onClose(), 1000);
  };

  /* ---------------------------------------------------------------
     RENDER
  --------------------------------------------------------------- */
  return (
    <div className="taskpopup-overlay">
      <div className="taskpopup-window">

        {/* ===== Balanced Header: left spacer | title | right group ===== */}
        <div className="tp-header">

          <div className="tp-header-left"></div>

          <h3 className="tp-header-title">{task.title}</h3>

          <div className="tp-header-right">
            <div className="tp-person" onClick={handleChangePerson}>
              {task.person || "Assign Person"}
            </div>
            <button className="tp-close-btn" onClick={handleClose}>✕</button>
          </div>

        </div>

        <div className="tp-body">
          <h4>Notes</h4>

          <textarea
            ref={areaRef}
            className="tp-note-draft"
            value={visibleText}
            onChange={handleChange}
            readOnly={isLocked}
          />
        </div>

        <div className="tp-footer">

          <div className="tp-gov-row">
            <button onClick={() => !isLocked && doAction({ gov: "CC" })}>CC</button>
            <button onClick={() => !isLocked && doAction({ gov: "QC" })}>QC</button>
            <button onClick={() => !isLocked && doAction({ gov: "Risk" })}>Risk</button>
            <button onClick={() => !isLocked && doAction({ gov: "Issue" })}>Issue</button>
            <button onClick={() => !isLocked && doAction({ gov: "Escalate" })}>Escalate</button>
            <button onClick={() => !isLocked && doAction({ gov: "Email" })}>Email</button>
            <button onClick={() => !isLocked && doAction({ gov: "Docs" })}>Docs</button>
            <button onClick={() => !isLocked && doAction({ gov: "Template" })}>Template</button>
          </div>

          <div className="tp-action-row">
            <button onClick={handleChangePerson}>Change Person</button>
            <button onClick={() => !isLocked && doAction({ status: "Completed" })}>
              Mark Completed
            </button>
            <button className="tp-delete" onClick={() => !isLocked && doAction({ delete: true })}>
              Delete
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
