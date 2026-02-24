/* ======================================================================
   METRA – RepositoryView.jsx
   Stage 348 – Corporate Repository (Task Templates Only)
   ====================================================================== */

import React, { useState } from "react";
import "../Styles/RepositoryView.css";
import { corporateTemplates } from "../data/corporateTemplates";

function getEligibleTaskTemplates({ discipline }) {
  if (!discipline) return [];

  return corporateTemplates.filter((t) => {
    const disciplineMatch =
      t.discipline === discipline || t.discipline === "both";

    return (
      t.status === "active" &&
      t.templateType === "task" &&
      disciplineMatch
    );
  });
}

export default function RepositoryView({
  discipline,
  onDownloadTask,
  onClose
}) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  const eligibleTemplates = getEligibleTaskTemplates({ discipline });

  const selectedTemplate =
    eligibleTemplates.find((t) => t.id === selectedTemplateId) || null;

  const handleSelect = (templateId) => {
    setSelectedTemplateId(templateId);
  };

  const handleDownload = () => {
    if (!selectedTemplate) return;

    onDownloadTask?.({
      title: selectedTemplate.title,
      description: selectedTemplate.description || ""
    });

    onClose?.();
  };

  return (
    <div className="repo-overlay">
      <div className="repo-topbar">
        <h2>Repository</h2>
        <button
          className="repo-close-btn"
          onClick={() => onClose?.()}
        >
          ✕
        </button>
      </div>

      <div className="repo-content">
        <div className="repo-filters">
          <h3>Discipline</h3>
          <p className="repo-placeholder">
            Active: {discipline || "None"}
          </p>
        </div>

        <div className="repo-tasks">
          <h3>Task Templates</h3>

          {eligibleTemplates.map((template) => {
            const isSelected = template.id === selectedTemplateId;

            return (
              <div
                key={template.id}
                className={`repo-task-row ${isSelected ? "selected" : ""}`}
                onClick={() => handleSelect(template.id)}
              >
                <div className="repo-task-title">
                  {template.title}
                </div>

                <div className="repo-task-desc">
                  {template.description}
                </div>
              </div>
            );
          })}

          {eligibleTemplates.length === 0 && (
            <div className="repo-placeholder">
              No task templates available for this discipline.
            </div>
          )}
        </div>
      </div>

      <div className="repo-bottombar">
        <button
          className="repo-return-btn"
          onClick={() => onClose?.()}
        >
          Return to Project
        </button>

        <button
          className="repo-download-btn"
          disabled={!selectedTemplate}
          onClick={handleDownload}
        >
          Download to Project
        </button>
      </div>
    </div>
  );
}
