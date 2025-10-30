/* ======================================================================
   METRA – PreProject.jsx
   Phase 3.7b – Governance Queue Toolbar Integration
   ----------------------------------------------------------------------
   • Standard PreProject task list (Define, Stakeholders, Feasibility)
   • PopupUniversal for log entries
   • Integrated 🧭 GovernanceQueuePreview panel (Export / Clear toolbar)
   ====================================================================== */

import React, { useState } from "react";
import PopupOverlayWrapper from "./PopupOverlayWrapper.jsx";
import GovernanceQueuePreview from "./GovernanceQueuePreview.jsx";
import "../Styles/PreProject.css";

export default function PreProject() {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Define project objectives", status: "Not Started" },
    { id: 2, name: "Identify key stakeholders", status: "Not Started" },
    { id: 3, name: "Prepare feasibility summary", status: "Not Started" },
  ]);

  const [selectedTask, setSelectedTask] = useState(null);

  // ------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------
  const handleOpenPopup = (task) => setSelectedTask(task);
  const handleClosePopup = () => setSelectedTask(null);

  const handleSavePopup = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    setSelectedTask(null);
  };

  const handleAddTask = () => {
    const newId = tasks.length + 1;
    const newTask = { id: newId, name: `New Task ${newId}`, status: "Not Started" };
    setTasks([...tasks, newTask]);
  };

  const handleClearAll = () => {
    if (window.confirm("Clear all tasks?")) setTasks([]);
  };

  // ------------------------------------------------------------------
  // Styling
  // ------------------------------------------------------------------
  const pageStyle = {
    backgroundColor: "#f9f9f9",
    fontFamily: "Segoe UI, system-ui, sans-serif",
    padding: "1.5rem",
  };

  const headerStyle = {
    background: "#0a2b5c",
    color: "#fff",
    padding: "0.75rem 1rem",
    borderRadius: "12px",
    marginBottom: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const taskCardStyle = {
    background: "#fff",
    padding: "1rem",
    borderRadius: "10px",
    marginBottom: "0.8rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const buttonStyle = {
    background: "#0a2b5c",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "0.4rem 0.8rem",
    marginLeft: "0.5rem",
    cursor: "pointer",
    fontWeight: "600",
  };

  const footerStyle = {
    marginTop: "1.5rem",
    display: "flex",
    gap: "1rem",
  };

  const addBtn = { ...buttonStyle, background: "#0078d4" };
  const clearBtn = { ...buttonStyle, background: "#6c6c6c" };

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <div>PreProject Phase</div>
        <button style={buttonStyle}>Return to Summary</button>
      </header>

      {tasks.map((task) => (
        <div key={task.id} style={taskCardStyle}>
          <strong>{task.name}</strong>
          <div>
            <button style={buttonStyle}>Start</button>
            <button
              style={{ ...buttonStyle, background: "#357edd" }}
              onClick={() => handleOpenPopup(task)}
            >
              Open Popup
            </button>
          </div>
        </div>
      ))}

      <div style={footerStyle}>
        <button style={addBtn} onClick={handleAddTask}>
          Add Task
        </button>
        <button style={clearBtn} onClick={handleClearAll}>
          Clear All
        </button>
      </div>

      {/* Popup Overlay */}
      {selectedTask && (
        <PopupOverlayWrapper
          task={selectedTask}
          onClose={handleClosePopup}
          onSave={handleSavePopup}
        />
      )}

      {/* Governance Queue Preview */}
      <div style={{ marginTop: "2rem" }}>
        <GovernanceQueuePreview />
      </div>
    </div>
  );
}
