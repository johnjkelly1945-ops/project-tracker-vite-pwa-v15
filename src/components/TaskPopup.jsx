/* ======================================================================
   METRA – TaskPopup.jsx
   Baseline – Stable Notes, Timestamp, CC, Personnel, Status
   ----------------------------------------------------------------------
   ✔ Notes with timestamp added on exit
   ✔ No 5-minute edit lock
   ✔ CC / QC / Risk / Issue / Escalate
   ✔ Change Person routing
   ✔ Mark Completed / Delete
   ✔ Template button (trigger only)
   ✔ No Docs button
   ----------------------------------------------------------------------
   This version matches DualPane’s current signature:
   onOpenTemplateRepo({ task, pane })
   ====================================================================== */

import React, { useState, useEffect, useRef } from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({
  task,
  pane,
  onClose,
  onUpdate,
  onOpenTemplateRepo     // ⭐ Template trigger
}) {
  if (!task) return null;

  const isLocked = !task.person || task.person.trim() === "";

  /* --------------------------------------------------------------
     NOTES NORMALISATION
  -------------------------------------------------------------- */
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

  /* --------------------------------------------------------------
     MERGE HISTORY + DRAFT
  -------------------------------------------------------------- */
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

  /* --------------------------------------------------------------
     HANDLE TYPING
  -------------------------------------------------------------- */
  const handleChange = (e) => {
    if (isLocked) return;

    const val = e.target.value;
    const boundary = historyText.length + (historyText ? 2 : 0);
    const newDraft = val.slice(boundary);

    setDraftText(newDraft);
    setVisibleText(historyText + (historyText ? "\n\n" : "") + newDraft);
  };

  /* --------------------------------------------------------------
     TIMESTAMP
  -------------------------------------------------------------- */
  const makeTimestamp = () => {
    const t = new Date();
    const dd = String(t.getDate()).padStart(2, "0");
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const yyyy = t.getFullYear();
    const HH = String(t.getHours()).padStart(2, "0");
    const MM = String(t.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${HH}:${MM}`;
  };

  /* --------------------------------------------------------------
     COMMIT NOTE
  -------------------------------------------------------------- */
  const commitEntry = async () => {
    if (isLocked) return null;
    const trimmed = draftText.trim();
    if (!trimmed) return null;

    const stamp = makeTimestamp();
    const entry = `${trimmed} – ${stamp}`;

    const updated =
      historyText ? `${historyText}\n\n${entry}` : entry;

    onUpdate({
      notes: updated + "\n\n",
      notesTimestamp: Date.now(),
      pane
    });

    return entry;
  };

  /* --------------------------------------------------------------
     PERSON CHANGE SYSTEM NOTE
  -------------------------------------------------------------- */
  const commitPersonChangeNote = () => {
    if (!task.person) return;

    const stamp = makeTimestamp();
    const note = `[System] Person changed from ${task.person} – ${stamp}`;

    const updated =
      historyText ? `${historyText}\n\n${note}` : note;

    onUpdate({
      notes: updated + "\n\n",
      notesTimestamp: Date.now(),
      pane
    });
  };

  const handleChangePerson = async () => {
    await commitEntry();
    commitPersonChangeNote();

    onUpdate({
      changePerson: true,
      id: task.id,
      pane
    });

    onClose();
  };

  /* --------------------------------------------------------------
     CC TWO-PRESS CONFIRMATION
  -------------------------------------------------------------- */
  const [ccConfirm, setCcConfirm] = useState(false);

  const makeCCNote = () => {
    const stamp = makeTimestamp();
    return `[System] Change Control request recorded – ${stamp}`;
  };

  const handleCC = async () => {
    if (isLocked) return;

    if (!ccConfirm) {
      setCcConfirm(true);
      return;
    }

    const note = makeCCNote();
    const updated =
      historyText ? `${historyText}\n\n${note}` : note;

    onUpdate({
      notes: updated + "\n\n",
      notesTimestamp: Date.now(),
      startChangeControl: true,
      flag: "red",
      pane
    });

    onClose();
  };

  /* --------------------------------------------------------------
     TEMPLATE TRIGGER
  -------------------------------------------------------------- */
  const handleTemplate = async () => {
    await commitEntry();
    if (onOpenTemplateRepo) onOpenTemplateRepo({ task, pane });
  };

  /* --------------------------------------------------------------
     CLOSE POPUP
  -------------------------------------------------------------- */
  const handleClose = async () => {
    await commitEntry();
    onClose();
  };

  /* --------------------------------------------------------------
     GENERIC ACTION HANDLER
  -------------------------------------------------------------- */
  const doAction = async (fields) => {
    if (!isLocked) await commitEntry();
    onUpdate({ ...fields, pane });
    onClose();
  };

  /* --------------------------------------------------------------
     RENDER
  -------------------------------------------------------------- */
  return (
    <div className="taskpopup-overlay" onClick={() => setCcConfirm(false)}>
      <div className="taskpopup-window" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="tp-header">
          <h3 className="tp-header-title">{task.title}</h3>

          <div className="tp-header-right">
            <div className="tp-person" onClick={handleChangePerson}>
              {task.person || "Assign Person"}
            </div>
            <button className="tp-close-btn" onClick={handleClose}>✕</button>
          </div>
        </div>

        {/* NOTES */}
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

        {/* CC CONFIRMATION */}
        {ccConfirm && (
          <div className="tp-cc-toast">
            This will activate the Change Control process.
            <br />
            Click CC again to continue.
          </div>
        )}

        {/* FOOTER */}
        <div className="tp-footer">

          <div className="tp-gov-row">
            <button onClick={handleCC}>CC</button>
            <button onClick={() => doAction({ gov: "QC" })}>QC</button>
            <button onClick={() => doAction({ gov: "Risk", flag: "red" })}>Risk</button>
            <button onClick={() => doAction({ gov: "Issue", flag: "red" })}>Issue</button>
            <button onClick={() => doAction({ gov: "Escalate", flag: "red" })}>Escalate</button>
            <button onClick={() => doAction({ gov: "Email" })}>Email</button>

            {/* ⭐ TEMPLATE BUTTON RESTORED */}
            <button onClick={handleTemplate}>Template</button>
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
