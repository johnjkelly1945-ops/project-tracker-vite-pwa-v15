// === METRA – Template Repository (Isolated Phase 6.3 Safe Integration) ===
// Standalone screen for managing local templates (read/add/delete).
// Uses embedded seed data. Returns safely to Summary.

import { useState, useEffect } from "react";

export default function TemplateRepository({ setActiveModule }) {
  const storageKey = "templateRepository";

  // === Default templates (local seed data) ===
  const defaultTemplates = [
    {
      id: "TMP-001",
      name: "Feasibility Report Template",
      category: "PreProject",
      url: "https://metra.local/templates/feasibility-v1.pdf",
      version: "1.0",
      status: "Approved",
      owner: "Document Control",
      dateCreated: "03 Nov 2025, 11:00",
    },
    {
      id: "TMP-002",
      name: "Risk Assessment Template",
      category: "Progress",
      url: "https://metra.local/templates/risk-assessment-v2.docx",
      version: "2.1",
      status: "Approved",
      owner: "H&S Department",
      dateCreated: "03 Nov 2025, 11:05",
    },
    {
      id: "TMP-003",
      name: "Project Kick-off Checklist",
      category: "Closure",
      url: "https://metra.local/templates/kickoff-checklist-v1.xlsx",
      version: "1.0",
      status: "Draft",
      owner: "PMO Office",
      dateCreated: "04 Nov 2025, 09:40",
    },
  ];

  const [templates, setTemplates] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : defaultTemplates;
  });

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    category: "",
    url: "",
    version: "",
    status: "",
    owner: "",
  });

  // === Persist to localStorage ===
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(templates));
  }, [templates]);

  // === Add template ===
  const addTemplate = () => {
    if (!newTemplate.name.trim()) return;
    const date = new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const template = { id: Date.now(), ...newTemplate, dateCreated: date };
    setTemplates([...templates, template]);
    setNewTemplate({
      name: "",
      category: "",
      url: "",
      version: "",
      status: "",
      owner: "",
    });
  };

  // === Delete template ===
  const deleteTemplate = (id) => {
    if (window.confirm("Delete this template?")) {
      setTemplates(templates.filter((t) => t.id !== id));
    }
  };

  return (
    <div
      style={{
        background: "#f9f9f9",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
        fontFamily: "Segoe UI, Avenir, Helvetica, Arial, sans-serif",
      }}
    >
      {/* === Header === */}
      <div
        style={{
          background: "#0a2b5c",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          width: "95%",
          maxWidth: "950px",
          margin: "12px auto 8px auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
        }}
      >
        <span
          style={{
            fontSize: "1.3rem",
            fontWeight: "800",
            color: "#ffd84d",
            fontStyle: "italic",
            transform: "skewX(-6deg)",
            letterSpacing: "1.2px",
          }}
        >
          METRA
        </span>
        <h2 style={{ flex: 1, textAlign: "center", margin: 0, fontSize: "1.05rem" }}>
          Template Repository
        </h2>
        <button
          onClick={() => setActiveModule("summary")}
          style={{
            background: "#0078d4",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "5px 10px",
            cursor: "pointer",
            fontSize: "0.8rem",
            fontWeight: "500",
          }}
        >
          Return to Summary
        </button>
      </div>

      {/* === Table Container === */}
      <div
        style={{
          width: "95%",
          maxWidth: "1000px",
          background: "white",
          borderRadius: "8px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          padding: "14px",
          overflowY: "auto",
          flex: 1,
        }}
      >
        {/* === Template Table === */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.85rem",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f0f4fa",
                borderBottom: "2px solid #ccc",
                textAlign: "left",
              }}
            >
              <th style={{ padding: "6px" }}>Name</th>
              <th style={{ padding: "6px" }}>Category</th>
              <th style={{ padding: "6px" }}>Version</th>
              <th style={{ padding: "6px" }}>Status</th>
              <th style={{ padding: "6px" }}>Owner</th>
              <th style={{ padding: "6px" }}>Date Created</th>
              <th style={{ padding: "6px" }}>Link</th>
              <th style={{ padding: "6px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((tpl) => (
              <tr key={tpl.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "6px" }}>{tpl.name}</td>
                <td style={{ padding: "6px" }}>{tpl.category}</td>
                <td style={{ padding: "6px" }}>{tpl.version}</td>
                <td style={{ padding: "6px" }}>{tpl.status}</td>
                <td style={{ padding: "6px" }}>{tpl.owner}</td>
                <td style={{ padding: "6px" }}>{tpl.dateCreated}</td>
                <td style={{ padding: "6px" }}>
                  {tpl.url ? (
                    <a
                      href={
                        tpl.url.startsWith("http")
                          ? tpl.url
                          : `https://${tpl.url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📄
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td style={{ padding: "6px" }}>
                  <button
                    onClick={() => deleteTemplate(tpl.id)}
                    style={{
                      background: "#e74c3c",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "3px 8px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* === Add New Template Section === */}
        <div style={{ marginTop: "12px" }}>
          <h4 style={{ color: "#0a2b5c", marginBottom: "6px" }}>Add New Template</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
            <input
              type="text"
              placeholder="Name"
              value={newTemplate.name}
              onChange={(e) =>
                setNewTemplate({ ...newTemplate, name: e.target.value })
              }
              style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "5px" }}
            />
            <input
              type="text"
              placeholder="Category"
              value={newTemplate.category}
              onChange={(e) =>
                setNewTemplate({ ...newTemplate, category: e.target.value })
              }
              style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "5px" }}
            />
            <input
              type="text"
              placeholder="Version"
              value={newTemplate.version}
              onChange={(e) =>
                setNewTemplate({ ...newTemplate, version: e.target.value })
              }
              style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "5px" }}
            />
            <input
              type="text"
              placeholder="Status"
              value={newTemplate.status}
              onChange={(e) =>
                setNewTemplate({ ...newTemplate, status: e.target.value })
              }
              style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "5px" }}
            />
            <input
              type="text"
              placeholder="Owner"
              value={newTemplate.owner}
              onChange={(e) =>
                setNewTemplate({ ...newTemplate, owner: e.target.value })
              }
              style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "5px" }}
            />
            <input
              type="url"
              placeholder="Link (URL)"
              value={newTemplate.url}
              onChange={(e) =>
                setNewTemplate({ ...newTemplate, url: e.target.value })
              }
              style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "5px" }}
            />
          </div>
          <button
            onClick={addTemplate}
            style={{
              background: "#0078d4",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "6px 12px",
              marginTop: "10px",
              cursor: "pointer",
            }}
          >
            ➕ Add Template
          </button>
        </div>
      </div>
    </div>
  );
}

