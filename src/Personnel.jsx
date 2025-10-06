import React, { useState, useEffect } from "react";
import "../Styles/App.css";

console.log("✅ Personnel component loaded (popup-stable baseline)");

export default function Personnel() {
  // --- State setup ---
  const [people, setPeople] = useState(() => {
    const saved = localStorage.getItem("personnel-list");
    return saved ? JSON.parse(saved) : [];
  });

  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [popupIndex, setPopupIndex] = useState(null);
  const [organisation, setOrganisation] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem("personnel-list", JSON.stringify(people));
  }, [people]);

  // --- Add a new person ---
  const addPerson = () => {
    if (!newName.trim() || !newRole.trim()) return;
    setPeople([
      ...people,
      {
        name: newName.trim(),
        role: newRole.trim(),
        organisation: "",
        department: "",
        email: "",
      },
    ]);
    setNewName("");
    setNewRole("");
  };

  // --- Delete a person ---
  const deletePerson = (index) => {
    setPeople(people.filter((_, i) => i !== index));
  };

  // --- Open popup with selected person details ---
  const openPopup = (person, index) => {
    setPopupIndex(index);
    setOrganisation(person.organisation || "");
    setDepartment(person.department || "");
    setEmail(person.email || "");
  };

  // --- Save popup edits ---
  const savePopup = () => {
    const updated = [...people];
    updated[popupIndex] = {
      ...updated[popupIndex],
      organisation,
      department,
      email,
    };
    setPeople(updated);
    setPopupIndex(null);
  };

  // --- Close popup without saving ---
  const closePopup = () => setPopupIndex(null);

  // --- Render ---
  return (
    <div className="personnel">
      <h2>Project Personnel</h2>

      <ul>
        {people.map((person, i) => (
          <li key={i}>
            <span>
              {person.name} – {person.role}
            </span>
            <div>
              <button className="view-btn" onClick={() => openPopup(person, i)}>
                View
              </button>
              <button className="delete-btn" onClick={() => deletePerson(i)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="add-person">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Name"
        />
        <input
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          placeholder="Role"
        />
        <button onClick={addPerson}>Add Person</button>
      </div>

      {popupIndex !== null && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>{people[popupIndex].name}</h3>
            <p><strong>Role:</strong> {people[popupIndex].role}</p>

            <input
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
              placeholder="Organisation"
            />
            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Department"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />

            <div className="popup-buttons">
              <button onClick={savePopup}>Save</button>
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
