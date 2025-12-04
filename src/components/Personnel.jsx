import React, { useState, useEffect } from "react";
import "../Styles/App.css";

console.log("✅ Personnel component loaded (popup enabled)");

export default function Personnel() {
  const [people, setPeople] = useState(() => {
    const saved = localStorage.getItem("personnel-list");
    return saved ? JSON.parse(saved) : [
      // Optional starter rows so you can test the popup quickly:
      // { name: "Jane Doe", role: "Project Manager", organisation: "", department: "", email: "" },
      // { name: "Alex Lee", role: "Developer", organisation: "", department: "", email: "" },
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
    localStorage.setItem("personnel-list", JSON.stringify(people));
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
    setPeople(prev => [...prev, newPerson]);
    setNewName("");
    setNewRole("");
  };

  const deletePerson = (index) => {
    setPeople(prev => prev.filter((_, i) => i !== index));
  };

  const openPopup = (person, index) => {
    setSelectedIndex(index);
    // Ensure all fields exist so inputs are controlled
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
    setPeople(prev => {
      const updated = [...prev];
      updated[selectedIndex] = { ...popupData };
      return updated;
    });
    setSelectedIndex(null);
  };

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

      {selectedIndex !== null && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <h3>Personnel Details</h3>

            <input
              value={popupData.name}
              onChange={(e) => setPopupData({ ...popupData, name: e.target.value })}
              placeholder="Name"
            />
            <input
              value={popupData.role}
              onChange={(e) => setPopupData({ ...popupData, role: e.target.value })}
              placeholder="Role"
            />
            <input
              value={popupData.organisation}
              onChange={(e) => setPopupData({ ...popupData, organisation: e.target.value })}
              placeholder="Organisation"
              autoComplete="organization"
            />
            <input
              value={popupData.department}
              onChange={(e) => setPopupData({ ...popupData, department: e.target.value })}
              placeholder="Department"
            />
            <input
              value={popupData.email}
              onChange={(e) => setPopupData({ ...popupData, email: e.target.value })}
              placeholder="Email"
              type="email"
              autoComplete="email"
            />

            <div className="popup-buttons">
              <button onClick={savePopup}>Save</button>
              <button onClick={closePopup}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
