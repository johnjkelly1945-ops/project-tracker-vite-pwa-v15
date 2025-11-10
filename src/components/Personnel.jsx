import React, { useEffect, useState } from "react";

/**
 * Personnel module with popup, persistence, and safety confirmations.
 */
export default function Personnel({ projectName }) {
  const storageKey = projectName
    ? `metra-${projectName}-personnel`
    : "personnel-list";

  const [people, setPeople] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(people));
    } catch {
      /* ignore write errors */
    }
  }, [people, storageKey]);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");

  // --- Open modal for adding person ---
  const openModal = () => {
    setName("");
    setRole("");
    setOrganisation("");
    setDepartment("");
    setLocation("");
    setEmail("");
    setShowModal(true);
  };

  // --- Confirm before closing modal ---
  const closeModal = () => {
    const hasData =
      name || role || organisation || department || location || email;
    if (hasData) {
      const confirmClose = window.confirm(
        "Discard any unsaved changes and close?"
      );
      if (!confirmClose) return;
    }
    setShowModal(false);
  };

  // --- Add new person ---
  const addPerson = () => {
    if (!name.trim()) return;
    const newPerson = {
      id: Date.now(),
      name: name.trim(),
      role: role.trim(),
      organisation: organisation.trim(),
      department: department.trim(),
      location: location.trim(),
      email: email.trim(),
    };
    setPeople((prev) => [...prev, newPerson]);
    setShowModal(false);
  };

  // --- Confirm before deleting ---
  const deletePerson = (id) => {
    const person = people.find((p) => p.id === id);
    if (
      window.confirm(
        `Are you sure you want to delete ${person?.name || "this person"}?`
      )
    ) {
      setPeople((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="checklist">
      <h2>Personnel</h2>

      {/* Add Person (green button) */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
        <button className="add-btn" onClick={openModal}>
          Add Person
        </button>
      </div>

      <ul style={{ paddingLeft: 0 }}>
        {people.length === 0 && (
          <li className="card">
            <div>
              <div className="card-title">No personnel added yet</div>
              <div style={{ color: "#666" }}>
                Click <strong>Add Person</strong> to include names, roles and contacts.
              </div>
            </div>
          </li>
        )}

        {people.map((p) => (
          <li key={p.id} className="card">
            <div style={{ flex: 1 }}>
              <div className="card-title">
                {p.name} {p.role ? `— ${p.role}` : ""}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#555" }}>
                {p.organisation && <span><strong>Org:</strong> {p.organisation} &nbsp; </span>}
                {p.department && <span><strong>Dept:</strong> {p.department} &nbsp; </span>}
                {p.location && <span><strong>Location:</strong> {p.location} &nbsp; </span>}
                {p.email && (
                  <span>
                    <strong>Email:</strong>{" "}
                    <a
                      href={`mailto:${p.email}`}
                      style={{ color: "#0077cc", textDecoration: "none" }}
                    >
                      {p.email}
                    </a>
                  </span>
                )}
              </div>
            </div>
            <div>
              <button className="delete-btn" onClick={() => deletePerson(p.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Person</h3>

            <div className="form-grid">
              <div className="full">
                <label>Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  autoFocus
                />
              </div>

              <div className="full">
                <label>Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Select role…</option>
                  <option>Project Manager</option>
                  <option>Business Analyst</option>
                  <option>Developer</option>
                  <option>QA / Tester</option>
                  <option>Stakeholder</option>
                </select>
              </div>

              <div>
                <label>Organisation</label>
                <input
                  value={organisation}
                  onChange={(e) => setOrganisation(e.target.value)}
                  placeholder="Company / Client"
                />
              </div>

              <div>
                <label>Department</label>
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Dept / Team"
                />
              </div>

              <div>
                <label>Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="HQ / Remote"
                />
              </div>

              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="close-btn" onClick={closeModal}>Cancel</button>
              <button className="btn-primary" onClick={addPerson}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
