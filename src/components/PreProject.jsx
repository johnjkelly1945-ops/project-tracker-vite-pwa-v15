// === METRA – PreProject Module (Phase 3.4 Step 2: Hover-Based Dropdown) ===
// Shows personnel dropdown when hovering over person icon.
// Smooth interaction, colour persistence, and full assignment logic retained.
// Baseline Target: baseline-2025-10-25-preproject-icon-hover-v1

import { useState, useEffect } from "react";
import { User } from "lucide-react";
import "../Styles/Checklist.css";

export default function PreProject({ setActiveModule }) {
  const taskKey = "preprojectTasks";
  const personnelKey = "personnel-list";

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(taskKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("All");
  const [personnel, setPersonnel] = useState([]);
  const [hoveredTask, setHoveredTask] = useState(null); // which task is being hovered

  // --- Load personnel list ---
  useEffect(() => {
    const stored = localStorage.getItem(personnelKey);
    if (stored) {
      try {
        setPersonnel(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing personnel-list:", e);
      }
    }
  }, []);

  // --- Auto-fix assigned status on load ---
  useEffect(() => {
    const updated = tasks.map((t) =>
      t.assignedTo && t.status === "Not Started"
        ? { ...t, status: "In Progress" }
        : t
    );
    if (JSON.stringify(updated) !== JSON.stringify(tasks)) setTasks(updated);
  }, []);

  // --- Persist tasks ---
  useEffect(() => {
    localStorage.setItem(taskKey, JSON.stringify(tasks));
  }, [tasks]);

  // --- Add new task ---
  const addTask = () => {
    if (!newTask.trim()) return;
    const timestamp = new Date().toLocaleString("en-GB");
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask.trim(),
        status: "Not Started",
        timestamp,
        flagged: false,
        assignedTo: "",
      },
    ]);
    setNewTask("");
  };

  // --- Delete task ---
  const deleteTask = (id) => {
    if (window.confirm("Delete this task?")) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  // --- Cycle status manually ---
  const cycleStatus = (id) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          let next;
          if (t.status === "Not Started") next = "In Progress";
          else if (t.status === "In Progress") next = "Completed";
          else next = "Not Started";
          return { ...t, status: next, timestamp: new Date().toLocaleString("en-GB") };
        }
        return t;
      })
    );
  };

  // --- Assign or unassign person ---
  const assignPerson = (taskId, personName) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          const now = new Date().toLocaleString("en-GB");
          const newStatus = personName ? "In Progress" : "Not Started";
          return {
            ...t,
            assignedTo: personName,
            status: newStatus,
            timestamp: now,
          };
        }
        return t;
      })
    );
    setHoveredTask(null); // hide dropdown after change
  };

  const getStatusClass = (s) =>
    s === "In Progress"
      ? "status-in-progress"
      : s === "Completed"
      ? "status-completed"
      : "status-not-started";

  const filtered = tasks.filter((t) =>
    filter === "All" ? true : filter === "Flagged" ? t.flagged : t.status === filter
  );

  return (
    <div className="checklist-container">
      {/* Header */}
      <div className="module-header-box inline">
        <span className="brand-large angled">METRA</span>
        <h2 className="module-subtitle">PreProject Module</h2>
        <button className="return-btn" onClick={() => setActiveModule("summary")}>
          Return to Summary
        </button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        {["All", "Not Started", "In Progress", "Completed", "Flagged"].map((type) => (
          <button
            key={type}
            className={`filter-btn ${filter === type ? "active" : ""}`}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Checklist */}
      <div className="checklist">
        <ul>
          {filtered.map((task) => (
            <li key={task.id} className={`task-item ${getStatusClass(task.status)}`}>
              <div className="task-text-area">
                <span className="task-text">{task.text}</span>
              </div>

              <div
                className="task-controls"
                style={{ position: "relative" }}
                onMouseLeave={() => setHoveredTask(null)}
              >
                {/* Status button */}
                <button
                  className="status-btn"
                  onClick={() => cycleStatus(task.id)}
                  title="Click to change status"
                >
                  {task.status}
                </button>

                {/* Person icon */}
                <button
                  className="assign-icon-btn"
                  onMouseEnter={() => setHoveredTask(task.id)}
                  title={
                    task.assignedTo
                      ? `Assigned to ${task.assignedTo} (hover to change)`
                      : "Hover to assign person"
                  }
                >
                  <User
                    size={18}
                    strokeWidth={2.6}
                    color={task.assignedTo ? "#0057b8" : "#666"}
                    style={{
                      verticalAlign: "middle",
                      transition: "all 0.2s ease",
                      filter: task.assignedTo
                        ? "drop-shadow(0 0 3px rgba(0, 123, 255, 0.6))"
                        : "drop-shadow(0 0 1px rgba(0, 0, 0, 0.3))",
                    }}
                  />
                </button>

                {/* Dropdown appears on hover */}
                {hoveredTask === task.id && (
                  <select
                    className="personnel-select dropdown-below"
                    value={task.assignedTo}
                    onChange={(e) => assignPerson(task.id, e.target.value)}
                    onMouseLeave={() => setHoveredTask(null)}
                    autoFocus
                  >
                    <option value="">— None —</option>
                    {personnel.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                )}

                {/* Timestamp + Delete */}
                <span className="timestamp">{task.timestamp}</span>
                <button className="delete" onClick={() => deleteTask(task.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}

          {/* Add new task */}
          <li className="task-item add-row">
            <div className="task-text-area">
              <input
                type="text"
                placeholder="Add new pre-project task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
            </div>
            <div className="task-controls">
              <button className="add" onClick={addTask}>
                Add
              </button>
            </div>
          </li>
        ))}
      </div>
    </div>
  );
}
