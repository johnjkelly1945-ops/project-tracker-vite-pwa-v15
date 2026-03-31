import React, { useState, useEffect } from "react";
import { setPersonnel } from "../domain/personnel/PersonnelRegistry";

/*
=====================================================================
METRA — PersonnelPanel.jsx
=====================================================================

STAGE
---------------------------------------------------------------------
Stage 255-C — Personnel Reference Pool Publisher

PURPOSE
---------------------------------------------------------------------
Provide a canonical Personnel workspace surface and publish the
personnel list to a read-only reference pool.

GUARDRAILS
---------------------------------------------------------------------
• PersonnelPanel remains the sole mutation surface
• External consumers are read-only
• No authority assertions
• No roles
• No persistence
• No assignment wiring

=====================================================================
*/

export default function PersonnelPanel() {
  const [people, setPeople] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  // Publish to read-only registry on any change
  useEffect(() => {
    setPersonnel(people);
  }, [people]);

  function handleSave(person) {
    setPeople((prev) => [...prev, person]);
    setShowAdd(false);
  }

  return (
    <div style={{ padding: "16px" }}>
      <h2>Personnel</h2>

      <button
        type="button"
        onClick={() => setShowAdd(true)}
        style={{ marginBottom: "12px" }}
      >
        Add Person
      </button>

      {showAdd && (
        <AddPersonCard
          onSave={handleSave}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {people.length === 0 ? (
        <div style={{ fontStyle: "italic", opacity: 0.7 }}>
          No personnel recorded.
        </div>
      ) : (
        <ul style={{ marginTop: "12px" }}>
          {people.map((p, i) => (
            <li key={i} style={{ marginBottom: "8px" }}>
              <strong>{p.displayName}</strong>
              {p.org && <div>{p.org}</div>}
              {p.email && <div>{p.email}</div>}
              {p.notes && <div style={{ opacity: 0.7 }}>{p.notes}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AddPersonCard({ onSave, onCancel }) {
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  /* ================= Stage 433 — Segment Authority ================= */

  const [isPM, setIsPM] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  function handleSave() {
    if (!name.trim()) return;

    onSave({
      displayName: name.trim(),
      org: org.trim(),
      email: email.trim(),
      notes: notes.trim(),

      /* ================= Stage 433 — Persist Authority ================= */
      isPM,
      isAdmin
    });
  }

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "12px",
        marginBottom: "12px",
      }}
    >
      <h3>Add Person</h3>

      <div style={{ marginBottom: "8px" }}>
        <label>
          Name<br />
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </div>

      <div style={{ marginBottom: "8px" }}>
        <label>
          Organisation / Source<br />
          <input value={org} onChange={(e) => setOrg(e.target.value)} />
        </label>
      </div>

      <div style={{ marginBottom: "8px" }}>
        <label>
          Email<br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>

      <div style={{ marginBottom: "8px" }}>
        <label>
          Notes<br />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
      </div>

      {/* ================= Stage 433 — Segment Authority ================= */}

      <div style={{ marginBottom: "8px" }}>
        <strong>Segment Authority</strong><br />

        <label>
          <input
            type="checkbox"
            checked={isPM}
            onChange={(e) => setIsPM(e.target.checked)}
          />
          Project Manager (PM)
        </label>

        <br />

        <label>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          Segment Admin
        </label>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button type="button" onClick={handleSave}>
          Save
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
