// @ts-nocheck
/*
=====================================================================
METRA — AddPersonCard.jsx
Stage 398 — Personnel Card Capture Surface
---------------------------------------------------------------------
Purpose:
• Capture structured personnel record
• Modal-contained interaction
• No external authority
• Returns full person object via onSave
=====================================================================
*/

import React, { useState } from "react";

export default function AddPersonCard({ onSave, onCancel }) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("Assignee");
  const [organisationType, setOrganisationType] = useState("internal");

  function handleSave() {
    if (!displayName.trim()) return;

    const safeName = displayName.trim();
    const safeEmail = email.trim();
    const safePhone = phone.trim();
    const safeDepartment = department.trim();

    const person = {
      id: `person-${Date.now()}`,
      displayName: safeName,
      email: safeEmail,
      phone: safePhone,
      department: safeDepartment,
      role,
      organisationType,
      title: safeName,
    };

    onSave(person);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ fontWeight: 600 }}>Add Person</div>

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

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        <option value="PM">PM</option>
        <option value="Assignee">Assignee</option>
        <option value="Advisor">Advisor</option>
        <option value="Admin">Admin</option>
      </select>

      <div style={{ display: "flex", gap: "8px" }}>
        <button type="button" onClick={handleSave}>Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
