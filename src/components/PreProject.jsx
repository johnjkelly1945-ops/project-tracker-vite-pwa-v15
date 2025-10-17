// === METRA – PreProject Module (Phase 3.6 Step 2: Assignment Flash + Unassign Option) ===
// Adds “None” option to unassign a person, retains blue flash + fade effects.
// Baseline Target: baseline-2025-10-28-preproject-assignflash-unassign-v13

import { useState, useEffect, useRef } from "react";
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
  const [openTaskId, setOpenTaskId] = useState(null);
  const [flashId, setFlashId] = useState(null);
  const hoverTimeout = useRef(null);

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

  // --- Auto-update assigned status ---
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
    setOpenTaskId(null);
    if (personName) {
      setFlashId(taskId);
      setTimeout(() => setFlashId(null), 600); // remove flash after 0.6 s
    }
  };

  // --- Hover controls ---
  const handleMouseEnter = (taskId) => {
    clearTimeout(hoverTimeout.current);
    setOpenTaskId(taskId);
  };
  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setOpenTaskId(null), 150);
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

  // --- Render ---
  return (
    <div className="checklist-container">
      <div className="module-header-box inline">
        <span className="brand-large angled">METRA</span>
        <h2 className="module-subtitle">PreProject Module</h2>
        <button className="return-btn" onClick={() => setActiveModule("summary")}>
          Return to Summary
        </button>
      </div>

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

      <div className="checklist">
        <ul>
          {filtered.map((task) => {
            const sortedPersonnel = [...personnel];
            if (task.assignedTo) {
              sortedPersonnel.sort((a, b) =>
                a.name === task.assignedTo ? -1 : b.name === task.assignedTo ? 1 : 0
              );
            }

            return (
              <li
                key={task.id}
                className={`task-item ${getStatusClass(task.status)} ${
                  flashId === task.id ? "flash-assign" : ""
                }`}
              >
                <div className="task-text-area">
                  <span className="task-text">{task.text}</span>
                </div>

                <div className="task-controls" style={{ position: "relative" }}>
                  {/* Status button */}
                  <button
                    className="status-btn"
                    onClick={() => cycleStatus(task.id)}
                    title="Click to change status"
                  >
                    {task.status}
                  </button>

                  {/* Hover icon and dropdown */}
                  <div
                    className="assign-hover-zone"
                    onMouseEnter={() => handleMouseEnter(task.id)}
                    onMouseLeave={handleMouseLeave}
                    style={{ display: "inline-block", position: "relative" }}
                  >
                    <User
                      size={18}
                      strokeWidth={2.6}
                      color={task.assignedTo ? "#0057b8" : "#666"}
                      style={{
                        verticalAlign: "middle",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        filter: task.assignedTo
                          ? "drop-shadow(0 0 3px rgba(0, 123, 255, 0.6))"
                          : "drop-shadow(0 0 1px rgba(0, 0, 0, 0.3))",
                      }}
                    />

                    {openTaskId === task.id && (
                      <div
                        className="personnel-dropdown fade-in"
                        style={{
                          position: "absolute",
                          top: "-6px",
                          left: "32px",
                          zIndex: 30,
                          background: "#fff",
                          border: "1px solid #ccc",
                          borderRadius: "6px",
                          boxShadow: "0 3px 8px rgba(0,0,0,0.18)",
                          width: "220px",
                          padding: "6px",
                          fontSize: "0.82rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onMouseEnter={() => handleMouseEnter(task.id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {/* small pointer arrow */}
                        <div
                          style={{
                            position: "absolute",
                            left: "-8px",
                            top: "10px",
                            width: 0,
                            height: 0,
                            borderTop: "6px solid transparent",
                            borderBottom: "6px solid transparent",
                            borderRight: "8px solid #ccc",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            left: "-7px",
                            top: "10px",
                            width: 0,
                            height: 0,
                            borderTop: "5px solid transparent",
                            borderBottom: "5px solid transparent",
                            borderRight: "7px solid #fff",
                            zIndex: 31,
                          }}
                        />

                        {/* Dropdown list */}
                        <div style={{ flex: 1 }}>
                          {/* Unassign option */}
                          <div
                            onClick={() => assignPerson(task.id, "")}
                            style={{
                              padding: "5px 8px",
                              borderRadius: "5px",
                              background: !task.assignedTo ? "#e6f0ff" : "transparent",
                              color: !task.assignedTo ? "#0057b8" : "#222",
                              fontWeight: !task.assignedTo ? "600" : "400",
                              cursor: "pointer",
                              marginBottom: "3px",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.background = !task.assignedTo
                                ? "#dce8ff"
                                : "#f5f5f5")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.background = !task.assignedTo
                                ? "#e6f0ff"
                                : "transparent")
                            }
                          >
                            — None —
                          </div>

                          {/* Personnel list */}
                          {sortedPersonnel.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => assignPerson(task.id, p.name)}
                              style={{
                                padding: "5px 8px",
                                borderRadius: "5px",
                                background:
                                  task.assignedTo === p.name ? "#e6f0ff" : "transparent",
                                color:
                                  task.assignedTo === p.name ? "#0057b8" : "#222",
                                fontWeight:
                                  task.assignedTo === p.name ? "600" : "400",
                                cursor: "pointer",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.background =
                                  task.assignedTo === p.name
                                    ? "#dce8ff"
                                    : "#f5f5f5")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.background =
                                  task.assignedTo === p.name
                                    ? "#e6f0ff"
                                    : "transparent")
                              }
                            >
                              {p.name}
                              {p.role ? ` – ${p.role}` : ""}
                              {p.department ? ` (${p.department})` : ""}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="timestamp">{task.timestamp}</span>
                  <button className="delete" onClick={() => deleteTask(task.id)}>
                    Delete
                  </button>
                </div>
              </li>
            );
          })}

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
