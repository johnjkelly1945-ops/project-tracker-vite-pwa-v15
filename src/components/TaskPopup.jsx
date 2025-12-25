/* ======================================================================
   METRA – TaskPopup.jsx
   v8.1 – Stage 15.0 Activation Enforcement
   ----------------------------------------------------------------------
   ✔ Assignment = activation (derived, not stored)
   ✔ Unassigned tasks are inert (non-executable)
   ✔ No new semantics, no UI redesign
   ====================================================================== */

import React, { useState, useEffect, useRef } from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({ task, pane, onClose, onUpdate }) {
  if (!task) return null;

  /* -------------------------------------------------------------------
     Stage 15.0 — Activation (Derived)
     Assignment present → active
     Assignment absent  → inactive
  ------------------------------------------------------------------- */
  const isAssigned = Boolean(task.person && task.person.trim());
  const isActive = isAssigned;
  const isLocked = !isActive;

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
  ------------------------------------------------------------------- */
  const handleChange = (e) => {
    if (!isActive) return;

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
     Commit entry safely
  ------------------------------------------------------------------- */
  const commitEntry = async () => {
    if (!isActive) return null;

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
     CC system note
  ------------------------------------------------------------------- */
  const makeCCSystemNote = () => {
    const stamp = makeTimestamp();
    return `[System] Change Control request recorded – ${stamp}`;
  };

  const [ccConfirm, setCcConfirm] = useState(false);

  /* -------------------------------------------------------------------
     CC handler (two-step)
  ------------------------------------------------------------------- */
  const handleCC = async () => {
    if (!isActive) return;

    if (!ccConfirm) {
      setCcConfirm(true);
      return;
    }

    const systemNote = makeCCSystemNote();
    const updatedHistory =
      historyText ? `${historyText}\n\n${systemNote}` : systemNote;

    onUpdate({
      notes: updatedHistory + "\n\n",
      notesTimestamp: Date.now(),
      startChangeControl: true,
      flag: "red",
      pane
    });

    onClose();
  };

  /* -------------------------------------------------------------------
     Close
  ------------------------------------------------------------------- */
  const handleClose = async () => {
    await commitEntry();
    onClose();
  };

  /* -------------------------------------------------------------------
     Change Person (allowed even if inactive)
  ------------------------------------------------------------------- */
  const handleChangePerson = async () => {
    await commitEntry();
    onUpdate({ changePerson: true, pane });
    onClose();
  };

  /* -------------------------------------------------------------------
     Footer governance / execution actions
  ------------------------------------------------------------------- */
  const doAction = async (fields) => {
    if (!isActive) return;
    await commitEntry();
    onUpdate({ ...fields, pane });
    onClose();
  };

  /* ====================================================================
     RENDER
     ==================================================================== */
  return (
    <div className="taskpopup-overlay" onClick={() => setCcConfirm(false)}>
      <div
        className="taskpopup-window"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
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

        {/* BODY */}
        <div className="tp-body">
          <h4>Notes</h4>
          <textarea
            ref={areaRef}
            className="tp-note-draft"
            value={visibleText}
            onChange={handleChange}
            readOnly={!isActive}
          />
        </div>

        {/* CC Toast */}
        {ccConfirm && (
          <div
            onClick={() => setCcConfirm(false)}
            style={{
              margin: "10px 20px",
              padding: "10px 14px",
              background: "#f2f4f7",
              borderLeft: "4px solid #003366",
              borderRadius: "6px",
              color: "#003366",
              fontSize: "0.9rem",
              lineHeight: "1.3",
              textAlign: "center",
              cursor: "pointer"
            }}
          >
            This will activate the Change Control process.
            <br />
            Click CC again to continue.
          </div>
        )}

        {/* FOOTER */}
        <div className="tp-footer">
          <div className="tp-gov-row">
            <button disabled={!isActive} onClick={handleCC}>CC</button>
            <button disabled={!isActive} onClick={() => doAction({ gov: "QC" })}>QC</button>
            <button disabled={!isActive} onClick={() => doAction({ gov: "Risk", flag: "red" })}>Risk</button>
            <button disabled={!isActive} onClick={() => doAction({ gov: "Issue", flag: "red" })}>Issue</button>
            <button disabled={!isActive} onClick={() => doAction({ gov: "Escalate", flag: "red" })}>Escalate</button>
            <button disabled={!isActive} onClick={() => doAction({ gov: "Email" })}>Email</button>
            <button disabled={!isActive} onClick={() => doAction({ gov: "Docs" })}>Docs</button>
            <button disabled={!isActive} onClick={() => doAction({ gov: "Template" })}>Template</button>
          </div>

          <div className="tp-action-row">
            <button onClick={handleChangePerson}>Change Person</button>
            <button disabled={!isActive} onClick={() => doAction({ status: "Completed" })}>
              Mark Completed
            </button>
            <button
              className="tp-delete"
              disabled={!isActive}
              onClick={() => doAction({ delete: true })}
            >
              Delete
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
