/* ======================================================================
   METRA – PersonnelDetail.jsx
   Phase 4.6B.13 Step 6F – Personnel Detail Popup (Classic METRA Layout)
   ----------------------------------------------------------------------
   Shows full personnel record when clicking an assigned person's name.
   ====================================================================== */

import React from "react";
import { PersonnelBridge } from "./Bridge/PersonnelBridge.js";
import "../Styles/PreProject.css";

export default function PersonnelDetail({ personId, onClose }) {
  const person = PersonnelBridge.getPersonnel().find(p => p.id === personId);

  if (!person) return null;

  return (
    <div className="overlay-backdrop">
      <div className="overlay-card" style={{ maxWidth: "450px" }}>
        <h2>Personnel Details</h2>

        <div style={{ lineHeight: "1.6", fontSize: "1rem" }}>
          <strong>Name:</strong><br />
          {person.name}<br /><br />

          {person.role && (
            <>
              <strong>Role:</strong><br />
              {person.role}<br /><br />
            </>
          )}

          {person.organisation && (
            <>
              <strong>Organisation:</strong><br />
              {person.organisation}<br /><br />
            </>
          )}

          {person.department && (
            <>
              <strong>Department:</strong><br />
              {person.department}<br /><br />
            </>
          )}

          {person.telephone && (
            <>
              <strong>Telephone:</strong><br />
              {person.telephone}<br /><br />
            </>
          )}

          {person.email && (
            <>
              <strong>Email:</strong><br />
              {person.email}<br /><br />
            </>
          )}

          <strong>Status:</strong><br />
          {person.active ? "Active" : "Inactive"}<br /><br />

          <strong>ID Reference:</strong><br />
          {person.id}<br />
        </div>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
