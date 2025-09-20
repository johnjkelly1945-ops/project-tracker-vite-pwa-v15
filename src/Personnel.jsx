import React, { useState } from "react";
import "./Personnel.css";

export default function Personnel() {
  // Prepopulated so you can confirm styling immediately
  const [personnel, setPersonnel] = useState([
    "Alice — Project Sponsor",
    "Bob — Project Manager"
  ]);
  const [name, setName] = useState("");

  const addPerson = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPersonnel((prev) => [...prev, trimmed]);
    setName("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addPerson();
  };

  const removePerson = (index) => {
    setPersonnel((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="personnel-section">
      <h2>Project Personnel</h2>

      <div className="personnel-input">
        <input
          type="text"
          placeholder="Enter name & role (e.g. Jane — Quality Manager)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="button" onClick={addPerson} className="add-btn">
          Add
        </button>
      </div>

      <ul className="personnel-list">
        {personnel.map((person, index) => (
          <li key={index}>
            <span>{person}</span>
            <button
              type="button"
              className="remove-btn"
              onClick={() => removePerson(index)}
              aria-label={`Remove ${person}`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
