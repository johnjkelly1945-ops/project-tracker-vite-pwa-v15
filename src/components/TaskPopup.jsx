/* ======================================================================
   METRA – TaskPopup.jsx
   v8.0 – Unified Pane-Aware Popup (Architecture B)
   ----------------------------------------------------------------------
   ✔ Pane-aware updates for both mgmt + dev
   ✔ Safe commitEntry (never sends undefined fields)
   ✔ Correct Change Person routing
   ✔ Correct CC two-step logic
   ✔ Notes merge + timestamp stable
   ====================================================================== */

import React, { useState, useEffect, useRef } from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({ task, pane, onClose, onUpdate }) {
  if (!task) return null;

  /* -------------------------------------------------------------------
     Locked if no assigned person
  ------------------------------------------------------------------- */
  const isLocked = !task.person || task.person.trim() === "";

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

    // Move cursor to start of draft region
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
    if (isLocked) return;

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
    if (isLocked) return;

    // First click → show toast
    if (!ccConfirm) {
      setCcConfirm(true);
      return;
    }

    // Second click → commit CC entry
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
     Change Person
  ------------------------------------------------------------------- */
  const handleChangePerson = async () => {
    await commitEntry();
    onUpdate({ changePerson: true, pane });
    onClose();
  };

  /* -------------------------------------------------------------------
     Footer governance actions
  ------------------------------------------------------------------- */
  const doAction = async (fields) => {
    if (!isLocked) {
      await commitEntry();
      onUpdate({ ...fields, pane });
    }
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
            readOnly={isLocked}
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
            <button onClick={handleCC}>CC</button>
            <button onClick={() => doAction({ gov: "QC" })}>QC</button>
            <button onClick={() => doAction({ gov: "Risk", flag: "red" })}>Risk</button>
            <button onClick={() => doAction({ gov: "Issue", flag: "red" })}>Issue</button>
            <button onClick={() => doAction({ gov: "Escalate", flag: "red" })}>Escalate</button>
            <button onClick={() => doAction({ gov: "Email" })}>Email</button>
            <button onClick={() => doAction({ gov: "Docs" })}>Docs</button>
            <button onClick={() => doAction({ gov: "Template" })}>Template</button>
          </div>

          <div className="tp-action-row">
            <button onClick={handleChangePerson}>Change Person</button>
            <button onClick={() => doAction({ status: "Completed" })}>
              Mark Completed
            </button>
            <button
              className="tp-delete"
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
