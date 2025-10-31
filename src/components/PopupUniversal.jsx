/* ======================================================================
   METRA – PopupUniversal.jsx
   Phase 4.2-A – Parent ↔ Child Audit Link Integration
   ----------------------------------------------------------------------
   • Adds parentAuditRef inheritance and storage
   • Maintains silent 5-minute edit rule and full audit logging
   • Compatible with metraConfig.enableContextAuditLink toggle
   ====================================================================== */

import React, { useState, useEffect } from "react";
import { metraConfig } from "../config/metraConfig";
import { logAuditEvent, listAuditEvents } from "../utils/auditHandler";
import "../Styles/PreProject.css";

const generateAuditRef = () =>
  "AUD-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 8);

export default function PopupUniversal({
  task,
  onClose,
  onSave,
  parentAuditRef = null,
  isSubPopup = false,
}) {
  if (!task) return null;

  const storageKey = `metra_preproject_task_${task?.id || "temp"}`;
  const [text, setText] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return "";
      const parsed = JSON.parse(saved);
      return typeof parsed === "string" ? parsed : String(parsed);
    } catch {
      return "";
    }
  });

  // ------------------------------------------------------------------
  // Determine audit reference hierarchy
  // ------------------------------------------------------------------
  const [auditRef, setAuditRef] = useState(
    task?.auditRef || parentAuditRef || generateAuditRef()
  );
  const [effectiveParentRef, setEffectiveParentRef] = useState(parentAuditRef || null);

  const [editableUntil, setEditableUntil] = useState(task?.editableUntil || null);
  const [isLocked, setIsLocked] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [auditEvents, setAuditEvents] = useState([]);

  // ------------------------------------------------------------------
  // Load audit events when toggled
  // ------------------------------------------------------------------
  useEffect(() => {
    if (showAudit && task?.id) {
      const events = listAuditEvents(task.id);
      setAuditEvents(events);
    }
  }, [showAudit, task]);

  // ------------------------------------------------------------------
  // Local persistence
  // ------------------------------------------------------------------
  useEffect(() => {
    const clean = typeof text === "object" ? JSON.stringify(text) : String(text ?? "");
    localStorage.setItem(storageKey, JSON.stringify(clean));
  }, [text, storageKey]);

  // ------------------------------------------------------------------
  // Silent lock timer
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!metraConfig.enableEditGracePeriod) {
      setIsLocked(true);
      return;
    }
    if (!editableUntil) return;

    const check = () => Date.now() >= editableUntil && setIsLocked(true);
    const i = setInterval(check, 10000);
    return () => clearInterval(i);
  }, [editableUntil]);

  // ------------------------------------------------------------------
  // Save handler
  // ------------------------------------------------------------------
  const handleSave = () => {
    const now = Date.now();
    let newUntil = null;

    if (metraConfig.enableEditGracePeriod) {
      newUntil = now + metraConfig.editGracePeriodMinutes * 60000;
      setEditableUntil(newUntil);
      setIsLocked(false);
    } else setIsLocked(true);

    const cleanText = String(text ?? "").trim();

    const updated = {
      ...task,
      notes: cleanText,
      timestamp: now,
      auditRef,
      parentAuditRef: effectiveParentRef,
      editableUntil: newUntil,
    };

    const isNew = !task?.auditRef;
    const eventType = isNew ? "CREATE" : isLocked ? "UPDATE" : "EDIT";

    // Build summary for audit log
    const taskLabel = task?.title || task?.name || `Task ${task?.id || "?"}`;
    const notePreview = `${taskLabel}: ${cleanText.substring(0, 200)}`;

    // ✅ include parentAuditRef if context linking enabled
    logAuditEvent({
      actionType: eventType,
      entityType: "Task",
      entityId: updated.id || "unassigned",
      auditRef,
      parentAuditRef: metraConfig.enableContextAuditLink ? effectiveParentRef : null,
      notePreview,
    });

    onSave(updated);
  };

  const handleReset = () => setText("");
  const canEdit = metraConfig.enableEditGracePeriod ? !isLocked : false;

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
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
        <button className="popup-btn-save" onClick={handleSave}>💾 Save</button>
        <button className="popup-btn-reset" onClick={handleReset}>↺ Reset</button>
        <button className="popup-btn-close" onClick={onClose}>✖ Close</button>
        <button className="popup-btn-audit" onClick={() => setShowAudit(!showAudit)}>
          📜 {showAudit ? "Hide Audit Trail" : "View Audit Trail"}
        </button>
      </div>

      {showAudit && (
        <div className="popup-audit-panel">
          {auditEvents.length === 0 ? (
            <p style={{ color: "#777" }}>No audit records for this task.</p>
          ) : (
            auditEvents.map((ev, i) => (
              <div key={i} className="popup-audit-line">
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontStyle: "italic",
                    color: "#666",
                    marginBottom: "0.15rem",
                    marginLeft: "0.5rem",
                  }}
                >
                  {new Date(ev.timestamp).toLocaleString()} – {ev.actionType} ({ev.entityType})
                  {ev.parentAuditRef && (
                    <span style={{ color: "#999", marginLeft: "0.5rem" }}>
                      ↳ Parent {ev.parentAuditRef}
                    </span>
                  )}
                </div>
                {ev.notePreview && (
                  <div
                    style={{
                      color: "#444",
                      fontSize: "0.9rem",
                      marginLeft: "1rem",
                      borderLeft: "2px solid #ccc",
                      paddingLeft: "0.5rem",
                      fontStyle: "italic",
                    }}
                  >
                    “{ev.notePreview}”
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
