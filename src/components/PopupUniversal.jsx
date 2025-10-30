/* ======================================================================
   METRA – PopupUniversal.jsx
   Phase 3.8 – Audit ↔ Governance Link Integration
   ----------------------------------------------------------------------
   • Inherits 3.3 audit logic (silent 5-minute edit window)
   • Adds silent governance queue linkage on Save
   • Uses addGovernanceRecord() from governanceQueueHandler.js
   • No visual indicators or alerts – fully background process
   ====================================================================== */

import React, { useState, useEffect } from "react";
import { metraConfig } from "../config/metraConfig";
import { logAuditEvent } from "../utils/auditHandler";
import { addGovernanceRecord } from "../utils/governanceQueueHandler";
import "../Styles/PreProject.css";

// Utility: create unique audit reference when none exists
const generateAuditRef = () =>
  "AUD-" +
  Date.now().toString(36) +
  "-" +
  Math.random().toString(36).substring(2, 8);

export default function PopupUniversal({
  task,
  onClose,
  onSave,
  parentAuditRef = null,
}) {
  // ----------------------------
  // Local state
  // ----------------------------
  const storageKey = `metra_preproject_task_${task?.id || "temp"}`;
  const [text, setText] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : "";
  });

  const [auditRef, setAuditRef] = useState(
    task?.auditRef || parentAuditRef || generateAuditRef()
  );

  const [editableUntil, setEditableUntil] = useState(
    task?.editableUntil || null
  );
  const [isLocked, setIsLocked] = useState(false);

  // ----------------------------
  // Local persistence (notes only)
  // ----------------------------
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(text));
  }, [text, storageKey]);

  // ----------------------------
  // Silent timer check (no UI output)
  // ----------------------------
  useEffect(() => {
    if (!metraConfig.enableEditGracePeriod) {
      setIsLocked(true);
      return;
    }
    if (!editableUntil) return;

    const checkLockStatus = () => {
      if (Date.now() >= editableUntil) setIsLocked(true);
    };
    const interval = setInterval(checkLockStatus, 10000); // check every 10 s
    return () => clearInterval(interval);
  }, [editableUntil]);

  // ----------------------------
  // Save handler (includes audit + governance log)
  // ----------------------------
  const handleSave = () => {
    const now = Date.now();
    let newEditableUntil = null;

    if (metraConfig.enableEditGracePeriod) {
      newEditableUntil = now + metraConfig.editGracePeriodMinutes * 60000;
      setEditableUntil(newEditableUntil);
      setIsLocked(false);
    } else {
      setIsLocked(true);
    }

    const updated = {
      ...task,
      notes: text,
      timestamp: now,
      auditRef,
      editableUntil: newEditableUntil,
    };

    const isNew = !task?.auditRef;
    const eventType = isNew ? "CREATE" : isLocked ? "UPDATE" : "EDIT";

    // 1️⃣ Log audit event
    logAuditEvent({
      actionType: eventType,
      entityType: "Task",
      entityId: updated.id || "unassigned",
      auditRef,
    });

    // 2️⃣ Add governance record silently (background only)
    addGovernanceRecord({
      auditRef,
      type: "Change",
      title: task?.title || "Untitled Task",
      timestamp: now,
    });

    // 3️⃣ Commit to parent save
    onSave(updated);
  };

  const handleReset = () => setText("");

  if (!task) return null;

  const canEdit = metraConfig.enableEditGracePeriod ? !isLocked : false;

  // ----------------------------
  // Render (identical visual structure)
  // ----------------------------
  return (
    <div className="popup-universal">
      <h2 className="popup-title">Log Entry – {task.title || "Untitled Task"}</h2>

      <textarea
        className="popup-textarea"
        placeholder="Type notes here…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!canEdit}
      />

      <div className="popup-buttons">
        <button className="popup-btn-save" onClick={handleSave}>
          💾 Save
        </button>
        <button className="popup-btn-reset" onClick={handleReset}>
          ↺ Reset
        </button>
        <button className="popup-btn-close" onClick={onClose}>
          ✖ Close
        </button>
      </div>
    </div>
  );
}
