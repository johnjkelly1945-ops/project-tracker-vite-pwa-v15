// src/components/PreProject.jsx
import React, { useState } from "react";
import "../Styles/Checklist.css";
import ModuleHeader from "./ModuleHeader";

/*
=====================================================================
METRA — Stage 11.0 Neutral PreProject Workspace
---------------------------------------------------------------------
• Demo seed data removed
• No localStorage rehydration
• Workspace loads empty and inert
• Behaviour intentionally minimal
=====================================================================
*/

export default function PreProject() {
  // Stage 11.0: start with an empty workspace
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Add task (allowed structurally, behaviour validated later)
  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { text: newTask.trim(), status: "Not started" }]);
    setNewTask("");
  };

  return (
    <div className="checklist">
      <ModuleHeader title="PreProject Module" />

      {/* Empty state is correct for Stage 11.0 */}
      {tasks.length === 0 && (
        <p style={{ opacity: 0.6, marginTop: "1rem" }}>
          No tasks defined.
        </p>
      )}

      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <div className="row">
              <span>{task.text}</span>
              <span>{task.status}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="add-task">
        <input
          type="text"
          placeholder="New task…"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
    </div>
  );
}
