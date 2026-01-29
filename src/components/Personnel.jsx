import React, { useState } from "react";
import "../Styles/App.css";
import { PersonnelBridge } from "./PersonnelBridge";

/*
=====================================================================
METRA — Personnel.jsx
Stage 233 — Minimal Operational Personnel Surface
---------------------------------------------------------------------
• Session-scoped personnel list (no persistence)
• Minimal record shape: { id, displayName }
• Explicit, deliberate assignment confirmation
• No profile editing, deletion, or governance semantics
=====================================================================
*/

export default function Personnel({
  task,
  onAssignComplete,
  onCancel,
}) {
  if (!task) {
    return (
      <div className="personnel">
        <h2>Personnel</h2>
        <p>No active task selected.</p>
      </div>
    );
  }

  /* ---------------- Minimal session-scoped personnel ---------------- */

  const [people, setPeople] = useState([]);
  const [newName, setNewName] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function addPerson() {
    const name = newName.trim();
    if (!name) return;

    const person = {
      id: `person-${Date.now()}`,
      displayName: name,
    };

    setPeople((prev) => [...prev, person]);
    setNewName("");
  }

  function confirmAssignment() {
    const person = people.find((p) => p.id === selectedId);
    if (!person) return;

    const updatedTask = PersonnelBridge.assignPerson(
      task,
      person.displayName
    );

    onAssignComplete(updatedTask);
  }

  /* ---------------- Render ---------------- */

  return (
    <div className="personnel">
      <h2>Assign Task</h2>

      <ul>
        {people.map((person) => (
          <li key={person.id}>
            <label>
              <input
                type="radio"
                name="person"
                checked={selectedId === person.id}
                onChange={() => setSelectedId(person.id)}
              />
              {person.displayName}
            </label>
          </li>
        ))}
      </ul>

      <div className="add-person">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New person name"
        />
        <button onClick={addPerson}>Add</button>
      </div>

      <div className="personnel-actions">
        <button onClick={onCancel}>Cancel</button>
        <button
          onClick={confirmAssignment}
          disabled={!selectedId}
        >
          Assign to task
        </button>
      </div>
    </div>
  );
}
