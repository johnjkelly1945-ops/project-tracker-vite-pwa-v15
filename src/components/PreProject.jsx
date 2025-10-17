// === METRA – PreProject Module (Phase 3.2 Step 2a) ===
// Adds “Assign Person” dropdown + persistent linkage to personnel-list
// Baseline Target: baseline-2025-10-23-preproject-personnel-assign-v1

import { useState, useEffect } from "react";
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

  // --- Persist tasks ---
  useEffect(() => {
    localStorage.setItem(taskKey, JSON.stringify(tasks));
  }, [tasks]);

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

  // --- Add new task ---
  const addTask = () => {
    if (!newTask.trim()) return;
    const timestamp = new Date().toLocaleString("en-GB");
    const newEntry = {
      id: Date.now(),
      text: newTask.trim(),
      status: "Not Started",
      timestamp,
      flagged: false,
      assignedTo: "",
    };
    setTasks([...tasks, newEntry]);
    setNewTask("");
  };

  // --- Delete task ---
  const deleteTask = (id) => {
    if (window.confirm("Delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  // --- Cycle through status values ---
  const cycleStatus = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          let newStatus;
          if (task.status === "Not Started") newStatus = "In Progress";
          else if (task.status === "In Progress") newStatus = "Completed";
          else newStatus = "Not Started";
          const updatedTime = new Date().toLocaleString("en-GB");
          return { ...task, status: newStatus, timestamp: updatedTime };
        }
        return task;
      })
    );
  };

  // --- Assign a person to task ---
  const assignPerson = (taskId, personName) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedTime = new Date().toLocaleString("en-GB");
          return {
            ...task,
            assignedTo: personName,
            status: "In Progress",
            timestamp: updatedTime,
          };
        }
        return task;
      })
    );
  };

  const getStatusClass = (status) => {
    if (status === "In Progress") return "status-in-progress";
    if (status === "Completed") return "status-completed";
    return "status-not-started";
  };

  // --- Filtering ---
  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    if (filter === "Flagged") return task.flagged === true;
    return task.status === filter;
  });

  // --- Render ---
  return (
    <div className="checklist-container">
      {/* === METRA Header === */}
      <div className="module-header-box inline">
        <span className="brand-large angled">METRA</span>
        <h2 className="module-subtitle">PreProject Module</h2>
        <button
          className="return-btn"
          onClick={() => setActiveModule("summary")}
        >
          Return to Summary
        </button>
      </div>

      {/* === Filter Bar === */}
      <div className="filter-bar">
        {["All", "Not Started", "In Progress", "Completed", "Flagged"].map(
          (type) => (
            <button
              key={type}
              className={`filter-btn ${filter === type ? "active" : ""}`}
              onClick={() => setFilter(type)}
            >
              {type}
            </button>
          )
        )}
      </div>

      {/* === Checklist === */}
      <div className="checklist">
        <ul>
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className={`task-item ${getStatusClass(task.status)}`}
            >
              <div className="task-text-area">
                <span className="task-text">{task.text}</span>
              </div>

              <div className="task-controls">
                {/* Status cycle */}
                <button
                  className="status-btn"
                  onClick={() => cycleStatus(task.id)}
                  title="Click to change status"
                >
                  {task.status}
                </button>

                {/* Assign person dropdown */}
                {personnel.length > 0 && (
                  <select
                    className="personnel-select"
                    value={task.assignedTo}
                    onChange={(e) =>
                      assignPerson(task.id, e.target.value)
                    }
                  >
                    <option value="">Assign Person</option>
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

          {/* Add new task row */}
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
        </ul>
      </div>
    </div>
  );
}
