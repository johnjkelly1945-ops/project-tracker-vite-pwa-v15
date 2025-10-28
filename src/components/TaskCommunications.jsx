/* ================================================================
   METRA – TaskCommunications.jsx
   ---------------------------------------------------------------
   Purpose:
   Records summaries of external communications (email, phone, etc.)
   with optional attachments and a friendly 5-minute edit window.

   Behaviour:
   • New entry → 5-min editable window starts
   • Edit clicked → timer pauses
   • Save → timer restarts (5 min) + popup “New entry”
   • After 5 min idle → entry locks silently
   • Interface tone: calm and simple (“New entry” only)
   ================================================================ */

import React, { useState, useEffect } from "react";
import {
  createAuditRecord,
  enforceAuditLock,
  getAuditState,
  pauseAuditTimer,
  resumeAuditTimer,
} from "../core/AuditCore";
import EditNoticePopup from "./EditNoticePopup"; // popup shows "New entry"

export default function TaskCommunications({ taskId, currentUser }) {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem(`comms-${taskId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [newEntry, setNewEntry] = useState({
    type: "email",
    summary: "",
    participants: "",
    attachment: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showNotice, setShowNotice] = useState(false);

  /* === Utility: persist to localStorage === */
  const saveAll = (updated) => {
    setEntries(updated);
    localStorage.setItem(`comms-${taskId}`, JSON.stringify(updated));
  };

  /* === Auto-lock enforcement every minute === */
  useEffect(() => {
    const timer = setInterval(() => {
      setEntries((prev) =>
        prev.map((e) => enforceAuditLock({ ...e }))
      );
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  /* === Add new communication summary === */
  const handleAdd = () => {
    if (!newEntry.summary.trim()) return;
    const entry = {
      id: Date.now().toString(),
      taskId,
      type: newEntry.type,
      summary: newEntry.summary.trim(),
      participants: newEntry.participants.trim(),
      attachment: newEntry.attachment.trim(),
      ...createAuditRecord(currentUser || "localUser"),
    };
    const updated = [...entries, entry];
    saveAll(updated);
    setNewEntry({ type: "email", summary: "", participants: "", attachment: "" });
    setShowNotice(true); // popup “New entry”
  };

  /* === Begin edit === */
  const handleEdit = (id) => {
    const entry = entries.find((e) => e.id === id);
    pauseAuditTimer(entry); // stop clock while editing
    setEditingId(id);
    saveAll([...entries]);
  };

  /* === Save edit === */
  const handleSaveEdit = (id, updatedText) => {
    const updated = entries.map((e) =>
      e.id === id ? { ...e, summary: updatedText } : e
    );
    const entry = updated.find((e) => e.id === id);
    resumeAuditTimer(entry); // restart 5-min window
    saveAll(updated);
    setEditingId(null);
    setShowNotice(true); // popup “New entry”
  };

  return (
    <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-base font-semibold mb-3 text-gray-700">
        Communication Summaries
      </h3>

      {/* === Existing entries list === */}
      <div className="space-y-3">
        {entries.map((entry) => {
          const state = getAuditState(entry);
          const isEditable = state === "editable";
          const isEditing = editingId === entry.id;

          return (
            <div
              key={entry.id}
              className="p-3 border border-gray-100 rounded-lg bg-gray-50"
            >
              <div className="text-sm text-gray-700">
                <strong>{entry.type.toUpperCase()}</strong>{" "}
                — {entry.participants || "unspecified"}
              </div>

              {!isEditing ? (
                <p className="text-gray-800 mt-1 whitespace-pre-wrap">
                  {entry.summary}
                </p>
              ) : (
                <textarea
                  value={entry.summary}
                  onChange={(e) =>
                    setEntries((prev) =>
                      prev.map((el) =>
                        el.id === entry.id
                          ? { ...el, summary: e.target.value }
                          : el
                      )
                    )
                  }
                  className="w-full border rounded-md p-2 text-sm text-gray-800 mt-1"
                />
              )}

              {entry.attachment && (
                <div className="text-xs text-blue-600 mt-1">
                  Attachment: {entry.attachment}
                </div>
              )}

              <div className="flex justify-end mt-2">
                {isEditing ? (
                  <button
                    onClick={() => handleSaveEdit(entry.id, entry.summary)}
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    Save
                  </button>
                ) : (
                  isEditable && (
                    <button
                      onClick={() => handleEdit(entry.id)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Edit
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* === Add new entry section === */}
      <div className="mt-4 border-t pt-3">
        <textarea
          value={newEntry.summary}
          onChange={(e) =>
            setNewEntry((prev) => ({ ...prev, summary: e.target.value }))
          }
          placeholder="New entry"
          className="w-full border rounded-md p-2 text-sm text-gray-800"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-700"
          >
            New entry
          </button>
        </div>
      </div>

      <EditNoticePopup
        visible={showNotice}
        onClose={() => setShowNotice(false)}
      />
    </div>
  );
}
