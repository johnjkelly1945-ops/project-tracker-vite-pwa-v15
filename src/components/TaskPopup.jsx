/* ======================================================================
   METRA – TaskPopup.jsx
   v21 – CC Toast Confirmation (Tap-to-Dismiss)
   ----------------------------------------------------------------------
   ✔ First CC click shows toast
   ✔ Second CC click performs actual CC
   ✔ Toast remains until user dismisses it
   ✔ Clicking INSIDE toast dismisses it
   ✔ Clicking anywhere except CC dismisses it
   ✔ CC triggers system note + red flag + close
   ====================================================================== */

import React, { useState, useEffect, useRef } from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({ task, onClose, onUpdate }) {
  if (!task) return null;

  /* ---------------------------------------------------------------
     Toast confirmation state
  --------------------------------------------------------------- */
  const [ccConfirm, setCcConfirm] = useState(false);

  /* ---------------------------------------------------------------
     Lock mode – task inactive until assigned
  --------------------------------------------------------------- */
  const isLocked = !task.person || task.person.trim() === "";

  /* ---------------------------------------------------------------
     Normalise history
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
     Merge history + draft on open
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
     Typing – dismiss toast when user interacts
  --------------------------------------------------------------- */
  const handleChange = (e) => {
    if (isLocked) return;

    if (ccConfirm) setCcConfirm(false);

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
     Timestamp helper
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
     Commit user entry
  --------------------------------------------------------------- */
  const commitEntry = () => {
    return new Promise((resolve) => {
      if (isLocked) return resolve(null);

      const trimmed = draftText.trim();
      if (trimmed === "") return resolve(null);

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
     CC System Note
  --------------------------------------------------------------- */
  const makeCCSystemNote = () => {
    const stamp = makeTimestamp();
    return `[System] Change Control request recorded – ${stamp}`;
  };

  /* ---------------------------------------------------------------
     CC Handler – Two-step confirmation
  --------------------------------------------------------------- */
  const handleCC = async () => {
    if (isLocked) return;

    // FIRST CLICK – show toast only
    if (!ccConfirm) {
      setCcConfirm(true);
      return;
    }

    // SECOND CLICK – perform CC
    const systemNote = makeCCSystemNote();
    const updatedHistory =
      historyText
        ? `${historyText}\n\n${systemNote}`
        : systemNote;

    onUpdate({
      notes: updatedHistory + "\n\n",
      notesTimestamp: Date.now(),
      startChangeControl: true,
      flag: "red"
    });

    onClose();
  };

  /* ---------------------------------------------------------------
     Dismiss toast except when CC is clicked
  --------------------------------------------------------------- */
  const dismissToast = () => {
    if (ccConfirm) setCcConfirm(false);
  };

  /* ---------------------------------------------------------------
     Close popup normally
  --------------------------------------------------------------- */
  const handleClose = async () => {
    if (ccConfirm) setCcConfirm(false);
    await commitEntry();
    onClose();
  };

  /* ---------------------------------------------------------------
     Change Person
  --------------------------------------------------------------- */
  const handleChangePerson = async () => {
    if (ccConfirm) setCcConfirm(false);
    await commitEntry();
    onUpdate({ changePerson: true });
    onClose();
  };

  /* ---------------------------------------------------------------
     Footer actions (Risk, QC, Issue, etc.)
  --------------------------------------------------------------- */
  const doAction = async (fields) => {
    if (ccConfirm) setCcConfirm(false);

    if (!isLocked) {
      await commitEntry();
      onUpdate(fields);
    }
    onClose();
  };

  /* ---------------------------------------------------------------
     Render
  --------------------------------------------------------------- */
  return (
    <div className="taskpopup-overlay" onClick={dismissToast}>
      <div
        className="taskpopup-window"
        onClick={(e) => e.stopPropagation()}  // prevents overlay click
      >

        {/* ==== HEADER ==== */}
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

        {/* ==== BODY ==== */}
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

        {/* ==== TOAST (click to dismiss) ==== */}
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

        {/* ==== FOOTER ==== */}
        <div className="tp-footer">

          <div className="tp-gov-row">
            <button onClick={handleCC}>CC</button>

            <button onClick={() => !isLocked && doAction({ gov: "QC" })}>QC</button>
            <button onClick={() => !isLocked && doAction({ gov: "Risk", flag: "red" })}>
              Risk
            </button>
            <button onClick={() => !isLocked && doAction({ gov: "Issue", flag: "red" })}>
              Issue
            </button>
            <button onClick={() => !isLocked && doAction({ gov: "Escalate", flag: "red" })}>
              Escalate
            </button>
            <button onClick={() => !isLocked && doAction({ gov: "Email" })}>Email</button>
            <button onClick={() => !isLocked && doAction({ gov: "Docs" })}>Docs</button>
            <button onClick={() => !isLocked && doAction({ gov: "Template" })}>Template</button>
          </div>

          <div className="tp-action-row">
            <button onClick={handleChangePerson}>Change Person</button>
            <button onClick={() => !isLocked && doAction({ status: "Completed" })}>
              Mark Completed
            </button>
            <button
              className="tp-delete"
              onClick={() => !isLocked && doAction({ delete: true })}
            >
              Delete
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
