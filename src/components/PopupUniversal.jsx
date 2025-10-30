/* ======================================================================
   METRA – PopupUniversal.jsx
   Phase 3.5 – Governance Bridge & Template Audit Integration (Corrected)
   ----------------------------------------------------------------------
   • Inherits full Phase 3.4 logic
   • Adds templateRef and governanceLink fields
   • Fixes note storage to plain text
   • Registers linked entity metadata in audit chain
   • Retains silent 5-minute edit window and UI layout
   ====================================================================== */

import React, { useState, useEffect } from "react";
import { metraConfig } from "../config/metraConfig";
import { logAuditEvent, registerLinkedEntity } from "../utils/auditHandler";
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
  templateRef = null,
  governanceLink = null,
}) {
  // ------------------------------------------------------------
  // Local state
  // ------------------------------------------------------------
  const storageKey = `metra_preproject_task_${task?.id || "temp"}`;

  // Load saved note text as plain string
  const [text, setText] = useState(() => localStorage.getItem(storageKey) || "");

  const [auditRef, setAuditRef] = useState(
    task?.auditRef || parentAuditRef || generateAuditRef()
  );
  const [editableUntil, setEditableUntil] = useState(task?.editableUntil || null);
  const [isLocked, setIsLocked] = useState(false);

  // ------------------------------------------------------------
  // Persist notes to localStorage (plain text)
  // ------------------------------------------------------------
  useEffect(() => {
    if (typeof text === "string") {
      localStorage.setItem(storageKey, text);
    }
  }, [text, storageKey]);

  // ------------------------------------------------------------
  // Silent timer for edit lock
  // ------------------------------------------------------------
  useEffect(() => {
    if (!metraConfig.enableEditGracePeriod) {
      setIsLocked(true);
      return;
    }
    if (!editableUntil) return;

    const checkLockStatus = () => {
      if (Date.now() >= editableUntil) setIsLocked(true);
    };
    const interval = setInterval(checkLockStatus, 10000); // every 10 s
    return () => clearInterval(interval);
  }, [editableUntil]);

  // ------------------------------------------------------------
  // Save handler
  // ------------------------------------------------------------
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
      notes: text, // store as plain text
      timestamp: now,
      auditRef,
      parentAuditRef: parentAuditRef || null,
      templateRef: templateRef || task?.templateRef || null,
      governanceLink: governanceLink || task?.governanceLink || null,
      editableUntil: newEditableUntil,
    };

    const isNew = !task?.auditRef;
    const eventType = isNew ? "CREATE" : isLocked ? "UPDATE" : "EDIT";

    // Log audit event
    logAuditEvent({
      actionType: eventType,
      entityType: "Task",
      entityId: updated.id || "unassigned",
      auditRef,
      linkedRef: templateRef || governanceLink || null,
    });

    // Register cross-link silently
    registerLinkedEntity(auditRef, {
      templateRef: templateRef || null,
      governanceLink: governanceLink || null,
    });

    onSave(updated);
  };

  const handleReset = () => setText("");

  if (!task) return null;

  const canEdit = metraConfig.enableEditGracePeriod ? !isLocked : false;

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  return (
    <div className="popup-universal">
      <h2 className="popup-title">
        Log Entry – {task.title || "Untitled Task"}
      </h2>

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
