/* ======================================================================
   METRA – PopupUniversal.jsx
   Phase 4.0 Step 3 – Visible Audit Panel Integration
   ----------------------------------------------------------------------
   • Adds 📜 View Audit Trail toggle button
   • Displays compact scrollable audit panel within popup
   • Reads task-specific audit events from auditHandler.js
   • No PMO exposure; panel hidden by default
   ====================================================================== */

import React, { useState, useEffect } from "react";
import { metraConfig } from "../config/metraConfig";
import { logAuditEvent, listAuditEvents } from "../utils/auditHandler";
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
  isSubPopup = false,
}) {
  if (!task) return null;

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

  const [editableUntil, setEditableUntil] = useState(task?.editableUntil || null);
  const [isLocked, setIsLocked] = useState(false);

  // ============================================================
  // Audit toggle + load logic
  // ============================================================
  const [showAudit, setShowAudit] = useState(false);
  const [auditEvents, setAuditEvents] = useState([]);

  useEffect(() => {
    if (showAudit && task?.id) {
      const events = listAuditEvents(task.id);
      setAuditEvents(events);
      console.log(`[AUDIT] Loaded ${events.length} entries for Task ${task.id}`);
    }
  }, [showAudit, task]);

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
    const interval = setInterval(checkLockStatus, 10000); // every 10 s
    return () => clearInterval(interval);
  }, [editableUntil]);

  // ----------------------------
  // Save handler
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

    logAuditEvent({
      actionType: eventType,
      entityType: "Task",
      entityId: updated.id || "unassigned",
      auditRef,
    });

    onSave(updated);
  };

  const handleReset = () => setText("");

  const canEdit = metraConfig.enableEditGracePeriod ? !isLocked : false;

  // ----------------------------
  // Render
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
        <button
          className="popup-btn-audit"
          onClick={() => setShowAudit(!showAudit)}
        >
          📜 {showAudit ? "Hide Audit Trail" : "View Audit Trail"}
        </button>
      </div>

      {showAudit && (
        <div className="popup-audit-panel">
          {auditEvents.length === 0 ? (
            <p style={{ color: "#777" }}>No audit records for this task.</p>
          ) : (
            auditEvents.map((ev, idx) => (
              <div key={idx} className="popup-audit-line">
                <b>{new Date(ev.timestamp).toLocaleTimeString()}</b> –{" "}
                {ev.actionType} ({ev.entityType})
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
