/* ======================================================================
   METRA – PopupUniversal.jsx
   Phase 4.1E – Stable Simplified Version
   ----------------------------------------------------------------------
   • Save keeps popup open
   • Close commits changes to parent
   • Scrollable audit panel
   ====================================================================== */

import React, { useState, useEffect } from "react";
import { metraConfig } from "../config/metraConfig";
import { logAuditEvent, listAuditEvents } from "../utils/auditHandler";
import "../Styles/PreProject.css";

const generateAuditRef = () =>
  "AUD-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 8);

export default function PopupUniversal({ task, onClose, onSave }) {
  if (!task) return null;

  const storageKey = `metra_preproject_task_${task?.id || "temp"}`;
  const [text, setText] = useState("");
  const [auditRef] = useState(task?.auditRef || generateAuditRef());
  const [editableUntil, setEditableUntil] = useState(task?.editableUntil || null);
  const [isLocked, setIsLocked] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [auditEvents, setAuditEvents] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '""');
      if (typeof saved === "string") setText(saved);
    } catch {
      setText("");
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(String(text ?? "")));
  }, [text, storageKey]);

  useEffect(() => {
    if (!metraConfig.enableEditGracePeriod) {
      setIsLocked(true);
      return;
    }
    if (!editableUntil) return;
    const timer = setInterval(() => {
      if (Date.now() >= editableUntil) setIsLocked(true);
    }, 10000);
    return () => clearInterval(timer);
  }, [editableUntil]);

  const handleSave = () => {
    const now = Date.now();
    const newUntil = metraConfig.enableEditGracePeriod
      ? now + metraConfig.editGracePeriodMinutes * 60000
      : null;
    if (newUntil) {
      setEditableUntil(newUntil);
      setIsLocked(false);
    } else setIsLocked(true);

    const cleanText = String(text ?? "").trim();
    const updated = { ...task, notes: cleanText, timestamp: now, auditRef, editableUntil: newUntil };

    const eventType = !task?.auditRef ? "CREATE" : isLocked ? "UPDATE" : "EDIT";
    const notePreview = `${task?.name || task?.title || "Task"}: ${cleanText.substring(0, 200)}`;
    logAuditEvent({
      actionType: eventType,
      entityType: "Task",
      entityId: updated.id || "unassigned",
      auditRef,
      notePreview,
    });

    if (task?.id) setAuditEvents(listAuditEvents(task.id));
  };

  const handleClose = () => {
    const now = Date.now();
    const updated = { ...task, notes: text, timestamp: now, auditRef, editableUntil };
    onSave(updated);
    onClose();
  };

  const canEdit = metraConfig.enableEditGracePeriod ? !isLocked : false;

  return (
    <div className="popup-universal">
      <h2 className="popup-title">Log Entry – {task.title || task.name}</h2>

      <textarea
        className="popup-textarea"
        style={{ width: "100%", minHeight: "120px" }}
        placeholder="Type notes here…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!canEdit}
      />

      <div className="popup-buttons">
        <button className="popup-btn-save" onClick={handleSave}>💾 Save</button>
        <button className="popup-btn-reset" onClick={() => setText("")}>↺ Reset</button>
        <button className="popup-btn-close" onClick={handleClose}>✖ Close</button>
        <button className="popup-btn-audit" onClick={() => setShowAudit(!showAudit)}>
          📜 {showAudit ? "Hide Audit Trail" : "View Audit Trail"}
        </button>
      </div>

      {showAudit && (
        <div
          style={{
            marginTop: "0.8rem",
            background: "#fafafa",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "0.6rem",
            maxHeight: "250px",
            overflowY: "auto",
          }}
        >
          {auditEvents.length === 0 ? (
            <p style={{ color: "#777" }}>No audit records.</p>
          ) : (
            auditEvents.map((ev, i) => (
              <div key={i} style={{ marginBottom: "0.5rem" }}>
                <div style={{ fontSize: "0.8rem", fontStyle: "italic", color: "#666" }}>
                  {new Date(ev.timestamp).toLocaleString()} – {ev.actionType} ({ev.entityType})
                </div>
                {ev.notePreview && (
                  <div style={{ fontSize: "0.9rem", color: "#444", marginLeft: "0.5rem" }}>
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
