/* ======================================================================
   METRA – TaskPopup.jsx
   FULL CLEAN VERIFIED VERSION – DEC 2025
   Stage 11.3.2 – Governance INTENT hooks only
   ----------------------------------------------------------------------
   ✔ Notes with timestamp merge correctly
   ✔ No 5-minute lock
   ✔ Change Person works
   ✔ CC / QC / Risk / Issue / Escalate (INTENT LOGGING ONLY)
   ✔ Email placeholder
   ✔ Template button fully routed
   ✔ SAFE DELETE (two-step)
   ✔ Toasts disappear instantly on click or typing
   ====================================================================== */

import React, { useState, useEffect, useRef } from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({
  task,
  pane,
  onClose,
  onUpdate,
  onOpenTemplateRepo
}) {
  if (!task) return null;

  const isLocked = !task.person || task.person.trim() === "";

  /* --------------------------------------------------------------
     STAGE 11.3.2 — GOVERNANCE INTENT (NO SIDE EFFECTS)
     Intent only. No persistence. No workflow.
  -------------------------------------------------------------- */
  const emitGovernanceIntent = (type) => {
    console.log("🟡 GOVERNANCE INTENT", {
      intent: "governance-entry",
      type, // CC | QC | Risk | Issue | Escalate | Email
      taskId: task.id,
      pane,
      origin: "workspace"
    });
  };

  /* --------------------------------------------------------------
     NORMALISE NOTES
  -------------------------------------------------------------- */
  const normaliseNotes = (v) => {
    if (typeof v === "string") return v;
    if (!v) return "";
    if (Array.isArray(v)) return v.join("\n");
    return String(v);
  };

  const historyText = normaliseNotes(task.notes).trimEnd();
  const [draftText, setDraftText] = useState("");
  const [visibleText, setVisibleText] = useState(historyText);
  const areaRef = useRef(null);

  /* --------------------------------------------------------------
     MERGE HISTORY + DRAFT
  -------------------------------------------------------------- */
  useEffect(() => {
    const merged =
      historyText + (historyText ? "\n\n" : "") + (draftText || "");

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

    setCcConfirm(false);
    setDeleteConfirm(false);

    const raw = e.target.value;
    const boundary = historyText.length + (historyText ? 2 : 0);

    const newDraft = raw.slice(boundary);
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
      pane
    });

    return entry;
  };

  /* --------------------------------------------------------------
     PERSON CHANGE LOGGING
  -------------------------------------------------------------- */
  const commitPersonChangeNote = () => {
    const stamp = makeTimestamp();
    const entry = `[System] Person changed – ${stamp}`;

    const updated =
      historyText ? `${historyText}\n\n${entry}` : entry;

    onUpdate({
      notes: updated + "\n\n",
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
     CC (two-step confirm)
     Stage 11.3.2 — INTENT HOOK ADDED
  -------------------------------------------------------------- */
  const [ccConfirm, setCcConfirm] = useState(false);

  const handleCC = async () => {
    if (isLocked) return;

    emitGovernanceIntent("CC");

    if (!ccConfirm) {
      setCcConfirm(true);
      return;
    }

    const stamp = makeTimestamp();
    const entry = `[System] Change Control activated – ${stamp}`;

    const updated =
      historyText ? `${historyText}\n\n${entry}` : entry;

    onUpdate({
      notes: updated + "\n\n",
      flag: "red",
      pane
    });

    onClose();
  };

  /* --------------------------------------------------------------
     TEMPLATE REPO BUTTON
  -------------------------------------------------------------- */
  const handleTemplate = async () => {
    await commitEntry();
    if (onOpenTemplateRepo)
      onOpenTemplateRepo({ task, pane });
  };

  /* --------------------------------------------------------------
     GENERIC ACTIONS
     Stage 11.3.2 — GOVERNANCE INTENT HOOK
  -------------------------------------------------------------- */
  const doAction = async (fields) => {
    if (fields.gov) {
      emitGovernanceIntent(fields.gov);
    }

    if (!isLocked) await commitEntry();
    onUpdate({ ...fields, pane });
    onClose();
  };

  /* --------------------------------------------------------------
     SAFE DELETE (two-step confirm)
  -------------------------------------------------------------- */
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    if (!isLocked) await commitEntry();

    onUpdate({
      delete: true,
      id: task.id,
      pane
    });

    onClose();
  };

  /* --------------------------------------------------------------
     CLOSE POPUP
  -------------------------------------------------------------- */
  const handleClose = async () => {
    await commitEntry();
    onClose();
  };

  /* ================================================================
     RENDER
  ================================================================ */
  return (
    <div
      className="taskpopup-overlay"
      onClick={() => {
        setCcConfirm(false);
        setDeleteConfirm(false);
      }}
    >
      <div
        className="taskpopup-window"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tp-header">
          <h3 className="tp-header-title">{task.title}</h3>

          <div className="tp-header-right">
            <div className="tp-person" onClick={handleChangePerson}>
              {task.person || "Assign Person"}
            </div>
            <button className="tp-close-btn" onClick={handleClose}>✕</button>
          </div>
        </div>

        <div
          className="tp-body"
          onClick={() => {
            setCcConfirm(false);
            setDeleteConfirm(false);
          }}
        >
          <h4>Notes</h4>
          <textarea
            ref={areaRef}
            className="tp-note-draft"
            value={visibleText}
            onChange={handleChange}
            readOnly={isLocked}
            onKeyDown={() => {
              setCcConfirm(false);
              setDeleteConfirm(false);
            }}
          />
        </div>

        {ccConfirm && (
          <div className="tp-cc-toast">
            Click CC again to activate Change Control.
          </div>
        )}

        {deleteConfirm && (
          <div className="tp-delete-toast">
            Click DELETE again to permanently remove this task.
          </div>
        )}

        <div className="tp-footer">
          <div className="tp-gov-row">
            <button onClick={handleCC}>CC</button>
            <button onClick={() => doAction({ gov: "QC" })}>QC</button>
            <button onClick={() => doAction({ gov: "Risk", flag: "red" })}>
              Risk
            </button>
            <button onClick={() => doAction({ gov: "Issue", flag: "red" })}>
              Issue
            </button>
            <button onClick={() => doAction({ gov: "Escalate", flag: "red" })}>
              Escalate
            </button>
            <button onClick={() => doAction({ gov: "Email" })}>Email</button>
            <button onClick={handleTemplate}>Template</button>
          </div>

          <div className="tp-action-row">
            <button onClick={handleChangePerson}>Change Person</button>
            <button onClick={() => doAction({ status: "Completed" })}>
              Mark Completed
            </button>
            <button className="tp-delete" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

