import React, { useState, useEffect } from "react";
import "../Styles/Checklist.css";

export default function Personnel() {
  const storageKey = "personnelTasks";

  const [people, setPeople] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved
      ? JSON.parse(saved)
      : [
          { name: "Alice", role: "Project Sponsor" },
          { name: "Bob", role: "Project Manager" }
        ];
  });

  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(people));
  }, [people]);

  const addPerson = () => {
    if (!newName.trim() || !newRole.trim()) return;
    setPeople([...people, { name: newName, role: newRole }]);
    setNewName("");
    setNewRole("");
  };

  const removePerson = (index) => {
    const updated = people.filter((_, i) => i !== index);
    setPeople(updated);
  };

  return (
    <div className="checklist">
      <h2>Project Personnel</h2>
      <ul>
        {people.map((p, i) => (
          <li key={i} className="status-not-started">
            {p.name} — {p.role}
            <button className="delete-btn" onClick={() => removePerson(i)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="add-task">
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
        <button onClick={addPerson}>Add</button>
      </div>
    </div>
  );
}
