/* ======================================================================
   METRA – TaskPopup.jsx
   v11 – Template Attach Integration (Restored)
   ----------------------------------------------------------------------
   Stage 11.2a:
   ✔ Structural restore only
   ✔ No document logic added yet
   ====================================================================== */

import React, { useState, useEffect, useRef } from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({
  task,
  pane,
  onClose,
  onUpdate,
  onAttachTemplate
}) {
  if (!task) return null;

  const isLocked = !task.person || task.person.trim() === "";

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

  const handleChange = (e) => {
    if (isLocked) return;
    const val = e.target.value;
    const boundary = historyText.length + (historyText ? 2 : 0);
    const newDraft = val.slice(boundary);
    setDraftText(newDraft);
    setVisibleText(historyText + (historyText ? "\n\n" : "") + newDraft);
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

  const commitEntry = async () => {
    if (isLocked) return null;
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

  const handleClose = async () => {
    await commitEntry();
    onClose();
  };

  const doAction = async (fields) => {
    if (!isLocked) {
      await commitEntry();
      onUpdate({ ...fields, pane });
    }
    onClose();
  };

  return (
    <div className="taskpopup-overlay">
      <div className="taskpopup-window">

        <div className="tp-header">
          <div className="tp-header-left"></div>
          <h3>{task.title}</h3>
          <div className="tp-header-right">
            <div className="tp-person">{task.person || "Assign Person"}</div>
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
            <button onClick={() => doAction({ gov: "CC" })}>CC</button>
            <button onClick={() => doAction({ gov: "QC" })}>QC</button>
            <button onClick={() => doAction({ gov: "Risk" })}>Risk</button>
            <button onClick={() => doAction({ gov: "Issue" })}>Issue</button>
            <button onClick={() => doAction({ gov: "Escalate" })}>Escalate</button>
            <button onClick={() => doAction({ gov: "Email" })}>Email</button>
            <button onClick={() => doAction({ gov: "Docs" })}>Docs</button>
            <button onClick={() => onAttachTemplate?.(task)}>Template</button>
          </div>

          <div className="tp-action-row">
            <button>Change Person</button>
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
