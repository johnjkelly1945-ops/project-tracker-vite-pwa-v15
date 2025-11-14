/* ======================================================================
   METRA – TaskWorkingWindow.jsx
   Step 7B – Compact Layout + Two-Step Delete + Dual Toast System
   ====================================================================== */

import React, { useState, useEffect } from "react";

/* ===== GLOBAL TOAST (bottom-centre) ===== */
function GlobalToast({ message }) {
  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "28px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(255,255,255,0.95)",
        padding: "10px 18px",
        borderRadius: "8px",
        fontSize: "0.95rem",
        zIndex: 99999,
        boxShadow: "0 0 18px rgba(0,0,0,0.15)"
      }}
    >
      {message}
    </div>
  );
}

export default function TaskWorkingWindow({
  task,
  onClose,
  onSaveNotes,
  onArchiveTask,
  onInvokeCC,
  onInvokeQC,
  onInvokeEscalate,
  onOpenPersonnelDetail
}) {

  /* ===== Notes ===== */
  const [noteInput, setNoteInput] = useState("");

  /* ===== Toast & delete states ===== */
  const [localToast, setLocalToast] = useState("");        // Toast above popup
  const [globalToast, setGlobalToast] = useState("");      // Toast bottom-centre
  const [deleteArmed, setDeleteArmed] = useState(false);

  /* Timestamp helper */
  const timestamp = () => {
    const now = new Date();
    return now.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  /* Add note */
  const addNote = () => {
    if (!noteInput.trim()) return;
    const entry = `[${timestamp()}] ${noteInput}`;
    onSaveNotes(task.id, entry);
    setNoteInput("");
  };

  /* ===== DELETE (TWO-STEP) ===== */
  const handleDeleteClick = () => {
    if (!deleteArmed) {
      /* FIRST CLICK — warn user */
      setDeleteArmed(true);
      setLocalToast("Click delete again to confirm");
      return;
    }

    /* SECOND CLICK — confirm delete */
    onArchiveTask(task.id);

    /* FINAL TOAST (outside popup) */
    setGlobalToast("Task archived");

    /* Close popup after short delay */
    setTimeout(() => {
      onClose();
    }, 800);
  };

  /* Fade away global toast */
  useEffect(() => {
    if (globalToast) {
      const t = setTimeout(() => setGlobalToast(""), 2500);
      return () => clearTimeout(t);
    }
  }, [globalToast]);

  /* Fade away local popup toast */
  useEffect(() => {
    if (localToast) {
      const t = setTimeout(() => setLocalToast(""), 2000);
      return () => clearTimeout(t);
    }
  }, [localToast]);

  return (
    <>
      {/* GLOBAL TOAST (fixed bottom centre) */}
      <GlobalToast message={globalToast} />

      <div className="ww-backdrop">
        <div className="ww-card" style={{ position: "relative" }}>

          {/* LOCAL TOAST ABOVE POPUP */}
          {localToast && (
            <div
              style={{
                position: "absolute",
                top: "-36px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(255,255,255,0.95)",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "0.9rem",
                zIndex: 1500
              }}
            >
              {localToast}
            </div>
          )}

          {/* ===== HEADER ===== */}
          <h2 className="ww-title">{task.title}</h2>

          {task.assigned && (
            <div
              style={{
                cursor: "pointer",
                textDecoration: "underline",
                marginBottom: "10px"
              }}
              onClick={onOpenPersonnelDetail}
            >
              — {task.assigned}
            </div>
          )}

          {/* ===== NOTES DISPLAY ===== */}
          <div className="ww-notes-display">
            {task.notes?.length > 0 ? (
              task.notes.map((n, i) => (
                <div key={i} className="ww-note-line">
                  {n}
                </div>
              ))
            ) : (
              <div className="ww-note-empty">No notes yet.</div>
            )}
          </div>

          {/* ===== NOTES INPUT ===== */}
          <textarea
            className="ww-input"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addNote();
              }
            }}
          />

          {/* ===== ROW 1 – COMPACT ACTIONS ===== */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "14px",
              marginTop: "14px",
              marginBottom: "14px",
              fontSize: "0.9rem"
            }}
          >
            <span style={{ cursor: "pointer" }} onClick={onInvokeCC}>CC</span>
            <span style={{ cursor: "pointer" }} onClick={onInvokeQC}>QC</span>

            <span
              style={{ cursor: "pointer" }}
              onClick={() => onSaveNotes(task.id, "[Risk]")}
            >
              Risk
            </span>

            <span
              style={{ cursor: "pointer" }}
              onClick={() => onSaveNotes(task.id, "[Issue]")}
            >
              Issue
            </span>

            <span style={{ cursor: "pointer" }} onClick={onInvokeEscalate}>
              Escalate
            </span>

            <span style={{ cursor: "pointer" }}>Email</span>
            <span style={{ cursor: "pointer" }}>Docs</span>
            <span style={{ cursor: "pointer" }}>Template</span>
          </div>

          {/* ===== ROW 2 – DELETE + CLOSE ===== */}
          <div
            style={{
              display: "flex",
              gap: "24px",
              marginBottom: "16px",
              fontSize: "0.9rem",
              fontWeight: deleteArmed ? "600" : "400"
            }}
          >
            <span
              style={{ cursor: "pointer", color: "#b91c1c" }}
              onClick={handleDeleteClick}
            >
              Delete
            </span>

            <span style={{ cursor: "pointer" }} onClick={onClose}>
              Close
            </span>
          </div>

        </div>
      </div>
    </>
  );
}
