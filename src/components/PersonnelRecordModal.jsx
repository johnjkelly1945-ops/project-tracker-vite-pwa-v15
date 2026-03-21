// @ts-nocheck
/*
=====================================================================
METRA — PersonnelRecordModal.jsx
Stage 404 — Personnel Record Surface (Read-Only)
Stage 405 — Stabilisation + Safe Registry Merge
Stage 406A — Edit Mode Toggle (No Mutation)
Stage 406B — Editable Surface (AddPersonCard Integration)
Stage 407 — Authority Enforcement (Edit Visibility Control)
=====================================================================
*/

import { useState } from "react";
import { createPortal } from "react-dom";
import AddPersonCard from "./AddPersonCard";
import { getPersonnel, setPersonnel } from "../domain/personnel/PersonnelRegistry";
import { canEditPersonnel } from "../domain/personnel/AuthorityResolver";

export default function PersonnelRecordModal({ person, onClose }) {
  if (!person) return null;

  const [editing, setEditing] = useState(false);

  const registryPerson = getPersonnel().find(p => p.id === person?.id);
  const resolvedPerson = registryPerson
    ? { ...person, ...registryPerson }
    : person;

  function handleSave(updatedPerson) {
    const current = Array.isArray(getPersonnel()) ? getPersonnel() : [];

    const updated = current.map(p =>
      p.id === updatedPerson.id ? updatedPerson : p
    );

    setPersonnel(updated);
    setEditing(false);
  }

  const canEdit = canEditPersonnel(resolvedPerson);

  return createPortal(
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      zIndex: 12000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        background: "#fff",
        width: "420px",
        padding: "20px",
        borderRadius: "8px"
      }}>
        <strong>Personnel Record</strong>

        {!editing && (
          <div style={{ marginTop: "10px" }}>
            <div><strong>Name:</strong> {resolvedPerson.displayName}</div>
            {resolvedPerson.role && <div><strong>Role:</strong> {resolvedPerson.role}</div>}
            {resolvedPerson.department && <div><strong>Department:</strong> {resolvedPerson.department}</div>}
            {resolvedPerson.organisation && <div><strong>Organisation:</strong> {resolvedPerson.organisation}</div>}
            {resolvedPerson.email && <div><strong>Email:</strong> {resolvedPerson.email}</div>}
            {resolvedPerson.phone && <div><strong>Phone:</strong> {resolvedPerson.phone}</div>}
          </div>
        )}

        {editing && (
          <div style={{ marginTop: "10px" }}>
            <AddPersonCard
              initialData={resolvedPerson}
              onSave={handleSave}
              onCancel={() => setEditing(false)}
            />
          </div>
        )}

        <div style={{ marginTop: "16px", textAlign: "right" }}>
          {!editing && canEdit && (
            <button onClick={() => setEditing(true)}>Edit</button>
          )}
          {editing && (
            <button onClick={() => setEditing(false)}>Cancel</button>
          )}
          <button onClick={onClose} style={{ marginLeft: "8px" }}>Close</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
