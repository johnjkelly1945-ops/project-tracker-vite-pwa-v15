// @ts-nocheck
import { useState } from "react";
import SubordinateSelectionModal from "./SubordinateSelectionModal";
import { getPersonnel, setPersonnel } from "../domain/personnel/PersonnelRegistry";

export default function TaskPopup({ task, onClose }) {
  const [assignOpen, setAssignOpen] = useState(false);
  const [showAddPerson, setShowAddPerson] = useState(false);

  function handleAssign(person) {
    console.log("Assigned:", person);
    setAssignOpen(false);
  }

  function handleAddPerson(person) {
    const current = getPersonnel();
    setPersonnel([...current, person]);
    setShowAddPerson(false);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h3>{task.title}</h3>

      <button onClick={() => setAssignOpen(true)}>Assign</button>

      {assignOpen && (
        <div>
          <SubordinateSelectionModal
            title="Assign Task"
            items={getPersonnel()}
            onSelect={handleAssign}
            onClose={() => setAssignOpen(false)}
          />

          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <button onClick={() => setShowAddPerson(true)}>
              + Add Person
            </button>
          </div>
        </div>
      )}

      {showAddPerson && (
        <AddPersonCard
          onSave={handleAddPerson}
          onCancel={() => setShowAddPerson(false)}
        />
      )}
    </div>
  );
}

function AddPersonCard({ onSave, onCancel }) {
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  function handleSave() {
    if (!name.trim()) return;

    onSave({
      displayName: name.trim(),
      org: org.trim(),
      email: email.trim(),
      notes: notes.trim(),
    });
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 4000,
      }}
    >
      <div style={{ background: "#fff", padding: "20px", width: "420px" }}>
        <strong>Add Person</strong>

        <input
          style={{ width: "100%", marginTop: "10px" }}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          style={{ width: "100%", marginTop: "8px" }}
          placeholder="Organisation"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
        />
        <input
          style={{ width: "100%", marginTop: "8px" }}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          style={{ width: "100%", marginTop: "8px" }}
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div style={{ marginTop: "12px", textAlign: "right" }}>
          <button onClick={handleSave}>Save</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
