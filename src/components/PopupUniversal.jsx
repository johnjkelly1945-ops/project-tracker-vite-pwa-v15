/* ======================================================================
   METRA – PopupUniversal.jsx
   Phase 4.1H8 – Save-Without-Close
   ----------------------------------------------------------------------
   • Keeps popup open after saving
   • Only closes when user clicks ✖ Close
   • Retains audit scroll + full-width text area from 4.1H7
   ====================================================================== */

import React, { useState, useEffect, useRef } from "react";
import { metraConfig } from "../config/metraConfig";
import { logAuditEvent, listAuditEvents } from "../utils/auditHandler";
import "../Styles/PreProject.css";

const generateAuditRef = () =>
  "AUD-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 8);

export default function PopupUniversal({ task, onClose, onSave, parentAuditRef = null }) {
  if (!task) return null;

  // ------------------------------------------------------------------
  // State
  // ------------------------------------------------------------------
  const storageKey = `metra_preproject_task_${task?.id || "temp"}`;
  const [text, setText] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : "";
    } catch {
      return "";
    }
  });

  const [auditRef] = useState(task?.auditRef || parentAuditRef || generateAuditRef());
  const [editableUntil, setEditableUntil] = useState(task?.editableUntil || null);
  const [isLocked, setIsLocked] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [auditEvents, setAuditEvents] = useState([]);
  const auditPanelRef = useRef(null);
  const entityKey = task?.id ? String(task.id) : auditRef;

  // ------------------------------------------------------------------
  // Load audit events
  // ------------------------------------------------------------------
  const loadAuditEvents = () => {
    const events = listAuditEvents(entityKey);
    setAuditEvents(events);
    setTimeout(() => {
      if (auditPanelRef.current)
        auditPanelRef.current.scrollTop = auditPanelRef.current.scrollHeight;
    }, 100);
  };

  useEffect(() => {
    if (showAudit) loadAuditEvents();
  }, [showAudit, task]);

  // ------------------------------------------------------------------
  // Local persistence
  // ------------------------------------------------------------------
  useEffect(() => {
    const clean = typeof text === "string" ? text.trim() : "";
    localStorage.setItem(storageKey, JSON.stringify(clean));
  }, [text, storageKey]);

  // ------------------------------------------------------------------
  // Grace-period watcher
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
  // Save handler (no auto-close)
  // ------------------------------------------------------------------
  const handleSave = () => {
    const now = Date.now();
    let newUntil = null;

    if (metraConfig.enableEditGracePeriod) {
      newUntil = now + metraConfig.editGracePeriodMinutes * 60000;
      setEditableUntil(newUntil);
      setIsLocked(false);
    } else {
      setIsLocked(true);
    }

    const cleanText = String(text || "").trim();
    const updated = { ...task, notes: cleanText, timestamp: now, auditRef, editableUntil: newUntil };

    const isNew = !task?.auditRef;
    const eventType = isNew ? "CREATE" : isLocked ? "UPDATE" : "EDIT";
    const label = task?.title || task?.name || `Task ${task?.id || "?"}`;
    const notePreview = `${label}: ${cleanText.substring(0, 200)}`;

    logAuditEvent({
      actionType: eventType,
      entityType: "Task",
      entityId: entityKey,
      auditRef,
      notePreview,
    });

    // Save data but keep popup open
    onSave(updated);
    loadAuditEvents();
  };

  const handleReset = () => setText("");
  const canEdit = metraConfig.enableEditGracePeriod ? !isLocked : false;

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <div className="popup-universal" style={{ width: "100%" }}>
      <h2 className="popup-title">Log Entry – {task.title || "Untitled Task"}</h2>

      <textarea
        className="popup-textarea"
        style={{
          width: "100%",
          minHeight: "10rem",
          maxHeight: "16rem",
          resize: "vertical",
          boxSizing: "border-box",
          padding: "0.6rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          fontFamily: "Segoe UI, system-ui, sans-serif",
          fontSize: "0.95rem",
          color: "#222",
          backgroundColor: "#fff",
        }}
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
        <div
          ref={auditPanelRef}
          className="popup-audit-panel"
          style={{
            maxHeight: "250px",
            overflowY: "auto",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "0.6rem",
            marginTop: "0.6rem",
            background: "#fafafa",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          {auditEvents.length === 0 ? (
            <p style={{ color: "#777" }}>No audit records for this task.</p>
          ) : (
            auditEvents.map((ev, i) => (
              <div key={i} style={{ marginBottom: "0.6rem" }}>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontStyle: "italic",
                    color: "#666",
                    marginBottom: "0.15rem",
                  }}
                >
                  {new Date(ev.timestamp).toLocaleString()} – {ev.actionType} ({ev.entityType})
                </div>
                <div
                  style={{
                    color: "#444",
                    fontSize: "0.9rem",
                    marginLeft: "0.6rem",
                    borderLeft: "2px solid #ccc",
                    paddingLeft: "0.5rem",
                    fontStyle: "italic",
                    wordBreak: "break-word",
                  }}
                >
                  “{String(ev.notePreview)}”
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
