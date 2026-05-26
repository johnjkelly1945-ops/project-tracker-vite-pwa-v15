// @ts-nocheck
/*
=====================================================================
METRA — AddPersonCard.jsx
Stage 398 — Personnel Card Capture Surface
Stage 406B — Edit Mode Support (Initial Data Injection)
---------------------------------------------------------------------
Purpose:
• Capture structured personnel record
• Support both create and edit flows
• Modal-contained interaction
• No external authority
• Returns full person object via onSave
=====================================================================
*/

import React, { useState } from "react";

export default function AddPersonCard({ onSave, onCancel, initialData }) {
  const [displayName, setDisplayName] = useState(initialData?.displayName || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [department, setDepartment] = useState(initialData?.department || "");
  const [organisation, setOrganisation] = useState(initialData?.organisation || "");
  const [organisationType, setOrganisationType] = useState(initialData?.organisationType || "internal");

  /* ================= Stage 433 — Segment Authority ================= */

  const [isPM, setIsPM] = useState(initialData?.isPM || false);
  const [isAdmin, setIsAdmin] = useState(initialData?.isAdmin || false);

const [authorityLevel, setAuthorityLevel] = useState(
  initialData?.authorityLevel || "NONE"
);

  function handleSave() {
    if (!displayName.trim()) return;

    const safeName = displayName.trim();
    const safeEmail = email.trim();
    const safePhone = phone.trim();
    const safeOrganisation = organisation.trim();
    const safeDepartment = department.trim();

    const person = {
      id: initialData?.id || `person-${Date.now()}`,
      displayName: safeName,
      email: safeEmail,
      organisation: safeOrganisation,
      phone: safePhone,
      department: safeDepartment,
      organisationType,
      title: safeName,

      /* ================= Stage 433 — Persist Authority ================= */
      isPM,
      isAdmin
        ,
        authorityLevel
    };

    onSave(person);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ fontWeight: 600 }}>
        {initialData ? "Edit Person" : "Add Person"}
      </div>

      <input
        type="text"
        placeholder="Full name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        style={{
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      <input
        type="text"
        placeholder="Department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        style={{
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      <input
        type="text"
        placeholder="Organisation"
        value={organisation}
        onChange={(e) => setOrganisation(e.target.value)}
        style={{
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      <select
        value={organisationType}
        onChange={(e) => setOrganisationType(e.target.value)}
        style={{
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        <option value="internal">Internal</option>
        <option value="external">External</option>
      </select>

      {/* ================= Stage 433 — Segment Authority ================= */}

      <div style={{ marginTop: "6px" }}>
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

          <div style={{ marginTop: "10px" }}>
            <strong>Authority Level</strong><br />

            <select
              value={authorityLevel}
              onChange={(e) => setAuthorityLevel(e.target.value)}
              style={{
                marginTop: "4px",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "100%"
              }}
            >
              <option value="NONE">None</option>
              <option value="FEASIBILITY">Feasibility</option>
              <option value="PROJECT">Project</option>
              <option value="PROGRAMME">Programme</option>
              <option value="FEDERATED_PROGRAMME">Federated Programme</option>
            </select>
          </div>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button type="button" onClick={handleSave}>Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
