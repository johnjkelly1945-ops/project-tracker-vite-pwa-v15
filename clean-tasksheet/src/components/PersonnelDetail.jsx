/* ======================================================================
   METRA – PersonnelDetail.jsx
   FINAL FIXED VERSION — StrictMode-Safe, Always Loads Notes Correctly
   + DEBUG BLOCK ADDED FOR VISIBILITY
   ====================================================================== */

import React, { useState, useEffect } from "react";
import "../Styles/PersonnelOverlay.css";

export default function PersonnelDetail({ personName, allTasks, onClose }) {

  console.log("RENDER: personName =", personName);

  /* ========== Defensive Guard ========== */
  if (!personName || typeof personName !== "string") {
    return (
      <div className="po-backdrop">
        <div className="po-card">
          <h2>No person selected</h2>
          <button className="po-close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const person = {
    name: personName,
    role: "Project Contributor",
  };

  /* ========== STORAGE KEY ========== */
  const storageKey = `person_notes_${person.name.replace(/ /g, "_")}`;

  /* ========== LOAD NOTES EVERY TIME PANEL OPENS ========== */
  const [personNotes, setPersonNotes] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    console.log("LOAD from localStorage key =", storageKey, "value =", saved);

    if (saved) {
      try {
        setPersonNotes(JSON.parse(saved));
      } catch {
        console.warn("Failed to parse saved notes for", storageKey);
        setPersonNotes([]);
      }
    } else {
      setPersonNotes([]);
    }
  }, [storageKey]);

  /* ========== SAVE NOTES ON DEMAND ========== */
  const [noteInput, setNoteInput] = useState("");

  const addPersonNote = () => {
    if (!noteInput.trim()) return;

    const entry = `${new Date().toLocaleString("en-GB")} — ${noteInput}`;
    const updated = [...personNotes, entry];

    console.log("SAVE to", storageKey, "=", updated);

    setPersonNotes(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    setNoteInput("");
  };

  /* ========== Assigned Tasks ========== */
  const assignedTasks = allTasks.filter((t) => t.assigned === person.name);

  /* ========== UI ========== */
  return (
    <div className="po-backdrop">
      <div className="po-card personnel-detail-card">

        <h2 className="po-title">Personnel Detail</h2>

        <div className="pd-section">
          <div className="pd-label">Name:</div>
          <div className="pd-value">{person.name}</div>
        </div>

        <div className="pd-section">
          <div className="pd-label">Role:</div>
          <div className="pd-value">{person.role}</div>
        </div>

        <h3 className="pd-subtitle">Profile Notes</h3>

        {/* ============================================================
           DEBUG BLOCK — SHOWS EXACT NOTES LOADED FROM STORAGE
        ============================================================ */}
        <div style={{
          background: "yellow",
          color: "black",
          padding: "6px",
          marginBottom: "10px",
          border: "1px solid black"
        }}>
          DEBUG NOTES: {JSON.stringify(personNotes)}
        </div>

        <div className="pd-notes-display">
          {personNotes.length === 0 ? (
            <div className="pd-empty">No notes yet.</div>
          ) : (
            personNotes.map((line, idx) => (
              <div key={idx} className="pd-note-line">{line}</div>
            ))
          )}
        </div>

        <textarea
          className="pd-input"
          value={noteInput}
          placeholder="Add a note about this person…"
          onChange={(e) => setNoteInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addPersonNote();
            }
          }}
        />

        <button className="pd-add-btn" onClick={addPersonNote}>
          Add Note
        </button>

        <h3 className="pd-subtitle">Assigned Tasks</h3>

        <div className="pd-task-list">
          {assignedTasks.length === 0 ? (
            <div className="pd-empty">No tasks assigned.</div>
          ) : (
            assignedTasks.map((t) => (
              <div key={t.id} className="pd-task-item">
                <div className="pd-task-title">{t.title}</div>
                <div className={`pd-status-dot ${t.status.replace(/ /g, "-")}`} />
              </div>
            ))
          )}
        </div>

        <button className="po-close-btn" onClick={onClose}>Close</button>

      </div>
    </div>
  );
}
