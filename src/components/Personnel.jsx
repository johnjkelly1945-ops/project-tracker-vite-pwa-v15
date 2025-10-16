// src/components/Personnel.jsx
import React, { useState, useEffect } from "react";
import "../Styles/Personnel.css";

export default function Personnel() {
  const storageKey = "personnel-list";

  const [people, setPeople] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [popupData, setPopupData] = useState({
    name: "",
    role: "",
    organisation: "",
    department: "",
    email: "",
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(people));
  }, [people]);

  // === Add new person ===
  const addPerson = () => {
    if (!newName.trim() || !newRole.trim()) return;
    const newPerson = {
      name: newName.trim(),
      role: newRole.trim(),
      organisation: "",
      department: "",
      email: "",
    };
    setPeople((prev) => [...prev, newPerson]);
    setNewName("");
    setNewRole("");
  };

  // === Delete person ===
  const deletePerson = (index) => {
    if (window.confirm("Delete this person?")) {
      setPeople((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // === Popup ===
  const openPopup = (person, index) => {
    setSelectedIndex(index);
    setPopupData({
      name: person.name || "",
      role: person.role || "",
      organisation: person.organisation || "",
      department: person.department || "",
      email: person.email || "",
    });
  };

  const closePopup = () => setSelectedIndex(null);

  const savePopup = () => {
    setPeople((prev) => {
      const updated = [...prev];
      updated[selectedIndex] = { ...popupData };
      return updated;
    });
    setSelectedIndex(null);
  };

  return (
    <div className="personnel-container">
      <header className="personnel-header">
        <div className="header-left">
          <h2>
            <span className="metra-brand">METRA</span> Project Personnel
          </h2>
        </div>
      </header>

      <div className="personnel-list">
        <ul>
          {people.map((person, i) => (
            <li key={i} className="person-row">
              <span className="person-text">
                {person.name} – {person.role}
              </span>
              <div className="person-buttons">
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

        <div className="add-person-row">
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
          <button className="add-btn" onClick={addPerson}>
            Add
          </button>
        </div>
      </div>

      {selectedIndex !== null && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <h3>Personnel Details</h3>

            <input
              value={popupData.name}
              onChange={(e) =>
                setPopupData({ ...popupData, name: e.target.value })
              }
              placeholder="Name"
            />
            <input
              value={popupData.role}
              onChange={(e) =>
                setPopupData({ ...popupData, role: e.target.value })
              }
              placeholder="Role"
            />
            <input
              value={popupData.organisation}
              onChange={(e) =>
                setPopupData({ ...popupData, organisation: e.target.value })
              }
              placeholder="Organisation"
            />
            <input
              value={popupData.department}
              onChange={(e) =>
                setPopupData({ ...popupData, department: e.target.value })
              }
              placeholder="Department"
            />
            <input
              value={popupData.email}
              onChange={(e) =>
                setPopupData({ ...popupData, email: e.target.value })
              }
              placeholder="Email"
              type="email"
            />

            <div className="popup-buttons">
              <button onClick={savePopup} className="save-btn">
                Save
              </button>
              <button onClick={closePopup} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
