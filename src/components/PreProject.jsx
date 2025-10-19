// === METRA – PreProject Module (Phase 5.1: Popup Running Log with Date-Stamped Entries) ===
// Adds running log history inside popup; appends new entries with timestamps.
// If viewed only, no change occurs. Outer timestamp updates only on modification.

import { useState, useEffect, useRef } from "react";
import { User } from "lucide-react";
import "../Styles/Checklist.css";

export default function PreProject({ setActiveModule }) {
  const taskKey = "preprojectTasks";
  const personnelKey = "personnel-list";

  const [tasks, setTasks] = useState(() =>
    JSON.parse(localStorage.getItem(taskKey) || "[]")
  );
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("All");
  const [personnel, setPersonnel] = useState([]);
  const [openTaskId, setOpenTaskId] = useState(null);
  const [popupTask, setPopupTask] = useState(null);
  const [purpose, setPurpose] = useState("");
  const [newLogEntry, setNewLogEntry] = useState("");
  const hoverTimeout = useRef(null);

  // --- Load personnel list ---
  useEffect(() => {
    const stored = localStorage.getItem(personnelKey);
    if (stored) {
      try {
        setPersonnel(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing personnel list:", e);
      }
    }
  }, []);

  // --- Auto update status for assigned tasks ---
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

  // --- Helper: current timestamp ---
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --- Add new task ---
  const addTask = () => {
    if (!newTask.trim()) return;
    const now = getCurrentTime();
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask.trim(),
        status: "Not Started",
        timestamp: now,
        flagged: false,
        assignedTo: "",
        purpose: "",
        logEntries: [], // array of {text, date}
      },
    ]);
    setNewTask("");
  };

  // --- Delete task ---
  const deleteTask = (id) => {
    if (window.confirm("Delete this task?"))
      setTasks(tasks.filter((t) => t.id !== id));
  };

  // --- Cycle status ---
  const cycleStatus = (id) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          let next =
            t.status === "Not Started"
              ? "In Progress"
              : t.status === "In Progress"
              ? "Completed"
              : "Not Started";
          return { ...t, status: next, timestamp: getCurrentTime() };
        }
        return t;
      })
    );
  };

  // --- Assign / unassign person ---
  const assignPerson = (taskId, personName) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              assignedTo: personName,
              status: personName ? "In Progress" : "Not Started",
              timestamp: getCurrentTime(),
            }
          : t
      )
    );
    setOpenTaskId(null);
  };

  // --- Popup open / save ---
  const openPopup = (task) => {
    setPopupTask(task);
    setPurpose(task.purpose || "");
    setNewLogEntry("");
  };

  const saveAndClosePopup = () => {
    if (!popupTask) return;

    const updatedTasks = tasks.map((t) => {
      if (t.id !== popupTask.id) return t;

      const changesMade =
        t.purpose !== purpose.trim() || newLogEntry.trim() !== "";

      if (!changesMade) return t; // viewed only

      const updatedLog = [...(t.logEntries || [])];

      // Add new entry if provided
      if (newLogEntry.trim() !== "") {
        updatedLog.push({
          text: newLogEntry.trim(),
          date: getCurrentTime(),
        });
      }

      return {
        ...t,
        purpose: purpose.trim(),
        logEntries: updatedLog,
        timestamp: getCurrentTime(),
      };
    });

    setTasks(updatedTasks);
    setPopupTask(null);
  };

  // --- Hover management ---
  const handleMouseEnter = (id) => {
    clearTimeout(hoverTimeout.current);
    setOpenTaskId(id);
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
    filter === "All"
      ? true
      : filter === "Flagged"
      ? t.flagged
      : t.status === filter
  );

  // --- Render ---
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

      {/* Filters */}
      <div className="filter-bar">
        {["All", "Not Started", "In Progress", "Completed", "Flagged"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Checklist */}
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
              <li key={task.id} className={`task-item ${getStatusClass(task.status)}`}>
                <div
                  className="task-text-area clickable"
                  onClick={() => openPopup(task)}
                  title="Click to view or edit task purpose and log"
                >
                  <span className="task-text">{task.text}</span>
                </div>

                <div className="task-controls" style={{ position: "relative" }}>
                  {/* Status button */}
                  <button className="status-btn" onClick={() => cycleStatus(task.id)}>
                    {task.status}
                  </button>

                  {/* Hover personnel zone */}
                  <div
                    className="assign-hover-zone"
                    onMouseEnter={() => handleMouseEnter(task.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <User
                      size={18}
                      strokeWidth={2.6}
                      color={task.assignedTo ? "#0057b8" : "#666"}
                      style={{
                        verticalAlign: "middle",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    />

                    {openTaskId === task.id && (
                      <div
                        className="personnel-dropdown"
                        onMouseEnter={() => handleMouseEnter(task.id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="pointer-outer"></div>
                        <div className="pointer-inner"></div>
                        {sortedPersonnel.length === 0 ? (
                          <div className="dropdown-empty">No personnel found</div>
                        ) : (
                          <>
                            <div
                              className={`dropdown-option ${
                                task.assignedTo === "" ? "active" : ""
                              }`}
                              onClick={() => assignPerson(task.id, "")}
                            >
                              — None —
                            </div>
                            {sortedPersonnel.map((p) => (
                              <div
                                key={p.id}
                                className={`dropdown-option ${
                                  task.assignedTo === p.name ? "active" : ""
                                }`}
                                onClick={() => assignPerson(task.id, p.name)}
                              >
                                {p.name}
                                {p.role ? ` – ${p.role}` : ""}
                                {p.department ? ` (${p.department})` : ""}
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Timestamp + Delete */}
                  <span className="timestamp">{task.timestamp}</span>
                  <button className="delete" onClick={() => deleteTask(task.id)}>
                    Delete
                  </button>
                </div>
              </li>
            );
          })}

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
        </ul>
      </div>

      {/* Popup overlay */}
      {popupTask && (
        <div className="popup-overlay" onClick={saveAndClosePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-title">{popupTask.text}</div>

            <label className="popup-subheader">PURPOSE</label>
            <textarea
              className="popup-purpose"
              placeholder="Define task purpose..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={2}
            />

            <hr className="popup-divider" />

            <div className="popup-log-section">
              <label className="popup-subheader">LOG HISTORY</label>
              <div className="popup-log-history">
                {popupTask.logEntries && popupTask.logEntries.length > 0 ? (
                  popupTask.logEntries.map((entry, idx) => (
                    <div key={idx} className="popup-log-entry">
                      <span className="popup-log-date">{entry.date}</span>
                      <div className="popup-log-text">{entry.text}</div>
                    </div>
                  ))
                ) : (
                  <div className="popup-log-empty">No log entries yet.</div>
                )}
              </div>

              <label className="popup-subheader">NEW ENTRY</label>
              <textarea
                className="popup-textarea"
                placeholder="Add new update or comment..."
                value={newLogEntry}
                onChange={(e) => setNewLogEntry(e.target.value)}
              />
            </div>

            <button className="close-popup" onClick={saveAndClosePopup}>
              Save & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
