/* ======================================================================
   METRA – PersonnelDetail.jsx
   Phase 4.6B.13 Step 6G – Editable Personnel Detail Popup
   ----------------------------------------------------------------------
   Adds editable fields, save/cancel, and active/inactive toggle.
   Uses METRA classic layout + blue action buttons.
   ====================================================================== */

import React, { useState } from "react";
import { PersonnelBridge } from "./Bridge/PersonnelBridge.js";
import "../Styles/PreProject.css";

export default function PersonnelDetail({ personId, onClose }) {
  const original = PersonnelBridge.getPersonnel().find(p => p.id === personId);
  if (!original) return null;

  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: original.name,
    role: original.role || "",
    organisation: original.organisation || "",
    department: original.department || "",
    telephone: original.telephone || "",
    email: original.email || "",
    active: original.active
  });

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const saveChanges = () => {
    PersonnelBridge.updatePerson(personId, form);
    setEditMode(false);
  };

  return (
    <div className="overlay-backdrop">
      <div className="overlay-card" style={{ maxWidth: "450px" }}>
        <h2>Personnel Details</h2>

        {/* =======================
            VIEW MODE (READ-ONLY)
           ======================= */}
        {!editMode && (
          <div style={{ lineHeight: "1.6", fontSize: "1rem" }}>
            <strong>Name:</strong><br />
            {form.name}<br /><br />

            {form.role && (
              <>
                <strong>Role:</strong><br />
                {form.role}<br /><br />
              </>
            )}

            {form.organisation && (
              <>
                <strong>Organisation:</strong><br />
                {form.organisation}<br /><br />
              </>
            )}

            {form.department && (
              <>
                <strong>Department:</strong><br />
                {form.department}<br /><br />
              </>
            )}

            {form.telephone && (
              <>
                <strong>Telephone:</strong><br />
                {form.telephone}<br /><br />
              </>
            )}

            {form.email && (
              <>
                <strong>Email:</strong><br />
                {form.email}<br /><br />
              </>
            )}

            <strong>Status:</strong><br />
            {form.active ? "Active" : "Inactive"}<br /><br />

            <strong>ID Reference:</strong><br />
            {personId}<br /><br />

            <button
              className="assign-btn"
              style={{ marginTop: "10px" }}
              onClick={() => setEditMode(true)}
            >
              Edit Personnel
            </button>
          </div>
        )}

        {/* =======================
            EDIT MODE
           ======================= */}
        {editMode && (
          <div style={{ lineHeight: "1.6", fontSize: "1rem" }}>
            <strong>Name (read-only):</strong><br />
            {form.name}<br /><br />

            <strong>Role:</strong><br />
            <input
              className="metra-input"
              value={form.role}
              onChange={(e) => updateField("role", e.target.value)}
            /><br /><br />

            <strong>Organisation:</strong><br />
            <input
              className="metra-input"
              value={form.organisation}
              onChange={(e) => updateField("organisation", e.target.value)}
            /><br /><br />

            <strong>Department:</strong><br />
            <input
              className="metra-input"
              value={form.department}
              onChange={(e) => updateField("department", e.target.value)}
            /><br /><br />

            <strong>Telephone:</strong><br />
            <input
              className="metra-input"
              value={form.telephone}
              onChange={(e) => updateField("telephone", e.target.value)}
            /><br /><br />

            <strong>Email:</strong><br />
            <input
              className="metra-input"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            /><br /><br />

            <strong>Status:</strong><br />
            <button
              className={form.active ? "active-btn" : "inactive-btn"}
              onClick={() => updateField("active", !form.active)}
            >
              {form.active ? "Active" : "Inactive"}
            </button>
            <br /><br />

            <button
              className="assign-btn"
              onClick={saveChanges}
              style={{ marginRight: "10px" }}
            >
              Save Personnel
            </button>

            <button
              className="close-btn"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Close popup */}
        {!editMode && (
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        )}
      </div>
    </div>
  );
}
