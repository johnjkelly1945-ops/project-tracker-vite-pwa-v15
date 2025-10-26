/* === METRA Phase 9.9A.1 – Expandable Ladder View ===
   Scalable single-user to corporate architecture.
   Focus: simplicity, persistence, and audit-safe refinement.
   Module: Change Control Popup (expandable steps, notes, links, and email refs)
   Verified baseline: 2025-10-28-changecontrol-popup-editable-v9.9A
   Next target: 2025-10-29-changecontrol-popup-expandable-ladder-v9.9A.1
--------------------------------------------------------------- */

import React, { useState, useEffect } from "react";

export default function TaskPopupChangeTest() {
  const STORAGE_KEY = "metra_change_steps_v9_9A1";

  const defaultSteps = [
    { id: 1, title: "Impact Assessment", status: "Not Started", notes: "", email: "", link: "", open: false },
    { id: 2, title: "Board Review", status: "Not Started", notes: "", email: "", link: "", open: false },
    { id: 3, title: "Implementation Verification", status: "Not Started", notes: "", email: "", link: "", open: false },
  ];

  const [steps, setSteps] = useState(defaultSteps);
  const [savedFlags, setSavedFlags] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setSteps(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(steps));
  }, [steps]);

  const toggleOpen = (id) =>
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, open: !s.open } : s))
    );

  const handleChange = (id, field, value) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
    showSaved(id, field);
  };

  const showSaved = (id, field) => {
    const key = `${id}_${field}`;
    setSavedFlags((p) => ({ ...p, [key]: true }));
    setTimeout(() => setSavedFlags((p) => ({ ...p, [key]: false })), 1500);
  };

  const handleStatus = (id, status) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    showSaved(id, "status");
  };

  const addStep = () => {
    const newStep = {
      id: Date.now(),
      title: "New Step",
      status: "Not Started",
      notes: "",
      email: "",
      link: "",
      open: false,
    };
    setSteps((prev) => [...prev, newStep]);
  };

  const resetToDefault = () => {
    if (window.confirm("Reset to default steps? (Local only)")) {
      localStorage.removeItem(STORAGE_KEY);
      setSteps(defaultSteps);
      setSavedFlags({});
    }
  };

  return (
    <div className="popup-container">
      <div className="popup-header">Change</div>
      <div className="popup-subheader">
        <strong>Change Matter:</strong> Cable Routing Review
      </div>

      <div className="popup-content">
        {steps.map((s) => (
          <div key={s.id} className="step-card">
            <div className="step-row" onClick={() => toggleOpen(s.id)}>
              <span className="caret">{s.open ? "▼" : "▸"}</span>
              <span className="step-title">{s.title}</span>
              <span className="status-label">{s.status}</span>
            </div>

            <div
              className={`expandable ${s.open ? "open" : ""}`}
              style={{
                maxHeight: s.open ? "400px" : "0px",
                transition: "max-height 0.4s ease",
                overflow: "hidden",
              }}
            >
              <div className="expand-inner">
                <div className="status-buttons">
                  <button onClick={() => handleStatus(s.id, "Started")}>
                    Start
                  </button>
                  <button onClick={() => handleStatus(s.id, "Completed")}>
                    Complete
                  </button>
                  <button onClick={() => handleStatus(s.id, "Not Started")}>
                    Reset
                  </button>
                  <span className="saved-flag">
                    {savedFlags[`${s.id}_status`] && "✔ Saved"}
                  </span>
                </div>

                <div className="field-block">
                  <label>Notes / Comms</label>
                  <textarea
                    rows="4"
                    value={s.notes}
                    onChange={(e) =>
                      handleChange(s.id, "notes", e.target.value)
                    }
                  />
                  <span className="saved-flag">
                    {savedFlags[`${s.id}_notes`] && "✔ Saved"}
                  </span>
                </div>

                <div className="field-block">
                  <label>📧 Email Ref</label>
                  <input
                    type="text"
                    placeholder="e.g. Email sent 25 Oct re: approval"
                    value={s.email}
                    onChange={(e) =>
                      handleChange(s.id, "email", e.target.value)
                    }
                  />
                  <span className="saved-flag">
                    {savedFlags[`${s.id}_email`] && "✔ Saved"}
                  </span>
                </div>

                <div className="field-block">
                  <label>🔗 Document Link</label>
                  <input
                    type="url"
                    placeholder="https://"
                    value={s.link}
                    onChange={(e) =>
                      handleChange(s.id, "link", e.target.value)
                    }
                  />
                  <span className="saved-flag">
                    {savedFlags[`${s.id}_link`] && "✔ Saved"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="action-row">
          <button onClick={addStep}>➕ Add Step</button>
          <button title="Local only reset" onClick={resetToDefault}>
            🔄 Reset to Default
          </button>
        </div>
      </div>

      <style jsx>{`
        .popup-container {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 700px;
          margin: auto;
          padding: 0;
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
          overflow-y: auto;
          max-height: 80vh;
        }
        .popup-header {
          background: #0a2b5c;
          color: white;
          font-weight: bold;
          padding: 0.5rem 1rem;
          border-radius: 6px 6px 0 0;
          text-align: center;
        }
        .popup-subheader {
          background: #eef1f6;
          padding: 0.5rem 1rem;
          border-bottom: 1px solid #ddd;
          font-size: 0.95rem;
        }
        .popup-content {
          padding: 1rem;
        }
        .step-card {
          border: 1px solid #ddd;
          border-radius: 6px;
          margin-bottom: 0.6rem;
          background: #f9fafc;
        }
        .step-row {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 0.5rem;
          font-weight: 600;
          font-size: 0.95rem;
          background: #eef3fb;
          border-radius: 6px;
        }
        .step-row:hover {
          background: #dce7fb;
        }
        .caret {
          margin-right: 0.5rem;
          width: 20px;
          text-align: center;
        }
        .step-title {
          flex: 1;
        }
        .status-label {
          font-size: 0.85rem;
          color: #333;
        }
        .expand-inner {
          padding: 0.6rem 0.8rem;
          background: #fff;
        }
        .field-block {
          display: flex;
          align-items: center;
          margin-top: 0.4rem;
        }
        .field-block label {
          width: 110px;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .field-block textarea,
        .field-block input {
          flex: 1;
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 0.4rem;
          font-size: 0.9rem;
          font-family: inherit;
        }
        .saved-flag {
          width: 65px;
          text-align: right;
          font-size: 0.85rem;
          color: #0a8d2a;
          margin-left: 0.3rem;
        }
        .status-buttons {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        button {
          background: #0a2b5c;
          color: white;
          border: none;
          padding: 0.35rem 0.7rem;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background: #17428a;
        }
        .action-row {
          display: flex;
          justify-content: space-between;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}
