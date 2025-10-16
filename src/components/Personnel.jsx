// === METRA – Personnel Module (v3.2: Isolated Popup Light Theme) ===
// Fully self-contained, persists via localStorage, popup with neutral background
// Compatible with isolated Personnel.css v3.2
// Baseline Target: baseline-2025-10-22-personnel-popup-isolated-v3.2

import React, { useState, useEffect } from "react";
import "../Styles/Personnel.css";

export default function Personnel({ setActiveModule }) {
  const storageKey = "personnel-list";

  const [people, setPeople] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved
      ? JSON.parse(saved)
      : [
          // optional seed data
          { name: "Jane Doe", role: "Project Manager", organisation: "Metra Ltd", department: "PMO", email: "jane@metra.com" },
          { name: "Alex Lee", role: "Developer", organisation: "Metra Ltd", department: "Engineering", email: "alex@metra.com" },
          { name: "Sam Carter", role: "Consultant", organisation: "Carter Advisory", department: "External", email: "sam@carteradvisory.com" },
        ];
  });

  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");

  // Popup state
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [popupData, setPopupData] = useState({
    name: "",
    role: "",
    organisation: "",
    department: "",
    email: "",
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(people));
  }, [people]);

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

  const deletePerson = (index) => {
    if (window.confirm("Delete this person?")) {
      setPeople((prev) => prev.filter((_, i) => i !== index));
    }
  };

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
      {/* === Header === */}
      <div className="personnel-header">
        <span className="metra-title">METRA</span>
        <h2>Project Personnel</h2>
        <button onClick={() => setActiveModule("summary")}>Return</button>
      </div>

      {/* === Personnel List === */}
      <div className="personnel-list-box">
        {people.map((person, i) => (
          <div key={i} className="person-row">
            <div className="person-info">
              {person.name} – {person.role}
            </div>
            <div className="person-controls">
              <button className="view-btn" onClick={() => openPopup(person, i)}>
                View
              </button>
              <button className="delete-btn" onClick={() => deletePerson(i)}>
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* Add New Person Row */}
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

      {/* === Popup === */}
      {selectedIndex !== null && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">Personnel Details</div>

            <div className="popup-content">
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
                  setPopupData({
                    ...popupData,
                    organisation: e.target.value,
                  })
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
                type="email"
                value={popupData.email}
                onChange={(e) =>
                  setPopupData({ ...popupData, email: e.target.value })
                }
                placeholder="Email"
              />
            </div>

            <div className="popup-buttons">
              <button className="save-btn" onClick={savePopup}>
                Save
              </button>
              <button className="cancel-btn" onClick={closePopup}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
