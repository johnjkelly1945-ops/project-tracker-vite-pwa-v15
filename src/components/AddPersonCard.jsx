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

      <div style={{ display: "flex", gap: "8px" }}>
        <button type="button" onClick={handleSave}>Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
