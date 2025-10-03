import React, { useState } from "react";

export default function Personnel() {
  const [team, setTeam] = useState([
    { name: "Alice", role: "Project Sponsor" },
    { name: "Bob", role: "Project Manager" }
  ]);

  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");

  const addMember = () => {
    if (newName.trim() === "" || newRole.trim() === "") return;
    setTeam([...team, { name: newName, role: newRole }]);
    setNewName("");
    setNewRole("");
  };

  const removeMember = (index) => {
    setTeam(team.filter((_, i) => i !== index));
  };

  return (
    <section className="box">
      <h2>Project Personnel</h2>
      <ul>
        {team.map((member, idx) => (
          <li key={idx}>
            {member.name} — {member.role} 
            <button onClick={() => removeMember(idx)}>Remove</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Role"
        value={newRole}
        onChange={(e) => setNewRole(e.target.value)}
      />
      <button className="add-btn" onClick={addMember}>Add</button>
    </section>
  );
}
