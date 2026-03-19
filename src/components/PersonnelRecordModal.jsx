// @ts-nocheck
/*
=====================================================================
METRA — PersonnelRecordModal.jsx
Stage 404 — Personnel Record Surface (Read-Only)
Stage 405 — Stabilisation + Safe Registry Merge
=====================================================================
*/

import { createPortal } from "react-dom";
import { getPersonnel } from "../domain/personnel/PersonnelRegistry";

export default function PersonnelRecordModal({ person, onClose }) {
  if (!person) return null;

  const registryPerson = getPersonnel().find(p => p.id === person?.id);
  const resolvedPerson = registryPerson
    ? { ...person, ...registryPerson }
    : person;

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

        <div style={{ marginTop: "10px" }}>
          <div><strong>Name:</strong> {resolvedPerson.displayName}</div>
          {resolvedPerson.role && <div><strong>Role:</strong> {resolvedPerson.role}</div>}
          {resolvedPerson.department && <div><strong>Department:</strong> {resolvedPerson.department}</div>}
          {resolvedPerson.email && <div><strong>Email:</strong> {resolvedPerson.email}</div>}
          {resolvedPerson.phone && <div><strong>Phone:</strong> {resolvedPerson.phone}</div>}
        </div>

        <div style={{ marginTop: "16px", textAlign: "right" }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
