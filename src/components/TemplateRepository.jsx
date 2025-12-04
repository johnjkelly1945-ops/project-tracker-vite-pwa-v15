/* ======================================================================
   METRA – TemplateRepository.jsx
   Baseline v1 – 03 December 2025
   ----------------------------------------------------------------------
   ✔ Loads template list from public/templates/templateLinks.json
   ✔ Allows user to preview & download templates
   ✔ Sends selected template back to DualPane → TaskPopup
   ✔ No footer/UI changes anywhere else
   ✔ No “Docs” feature, no experimental code
   ====================================================================== */

import React, { useEffect, useState } from "react";
import "../Styles/RepositoryModule.css";

export default function TemplateRepository({ onClose, onSelectTemplate }) {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const res = await fetch("/templates/templateLinks.json");
        const data = await res.json();
        setTemplates(data);
      } catch (err) {
        console.error("Failed to load templates:", err);
      }
    };

    loadTemplates();
  }, []);

  const handleSelect = (tpl) => {
    setSelected(tpl);
  };

  const handleAttach = () => {
    if (selected && onSelectTemplate) {
      onSelectTemplate(selected);
      onClose();
    }
  };

  return (
    <div className="repo-overlay">
      <div className="repo-window">
        <div className="repo-header">
          <h2>Template Library</h2>
          <button className="repo-close" onClick={onClose}>✕</button>
        </div>

        <div className="repo-body">

          {/* LEFT LIST */}
          <div className="repo-list">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className={`repo-item ${selected?.id === tpl.id ? "selected" : ""}`}
                onClick={() => handleSelect(tpl)}
              >
                {tpl.name}
              </div>
            ))}
          </div>

          {/* RIGHT PREVIEW PANEL */}
          <div className="repo-preview">
            {!selected ? (
              <div className="repo-placeholder">Select a template to preview</div>
            ) : (
              <div className="repo-preview-content">
                <h3>{selected.name}</h3>

                <p><strong>Category:</strong> {selected.category}</p>

                <a
                  href={selected.url}
                  download
                  className="repo-download-btn"
                >
                  Download Template
                </a>

                <button
                  className="repo-attach-btn"
                  onClick={handleAttach}
                >
                  Attach to Task
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
