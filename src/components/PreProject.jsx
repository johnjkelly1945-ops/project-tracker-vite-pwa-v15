// === METRA – PreProject Module (Phase 6.2: Intelligent Log Tracking of Assignee Changes) ===
// Adds automatic log entries whenever task assignee changes.
// Preserves popup UI, template links, scroll-safe layout, and persistence.

import { useState, useEffect, useRef } from "react";
import { User, Paperclip, X } from "lucide-react";
import "../Styles/Checklist.css";

export default function PreProject({ setActiveModule }) {
  const taskKey = "preprojectTasks";
  const personnelKey = "personnel-list";

  const [tasks, setTasks] = useState(() => {
    const stored = JSON.parse(localStorage.getItem(taskKey) || "[]");
    console.log("Loaded tasks with template array:", stored);
    return stored.map((t) => ({ ...t, templates: t.templates || [] }));
  });

  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("All");
  const [personnel, setPersonnel] = useState([]);
  const [openTaskId, setOpenTaskId] = useState(null);
  const [popupTask, setPopupTask] = useState(null);
  const [purpose, setPurpose] = useState("");
  const [newLogEntry, setNewLogEntry] = useState("");
  const [newLogLink, setNewLogLink] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateUrl, setTemplateUrl] = useState("");
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

  // --- Auto update status ---
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
        logEntries: [],
        templates: [],
      },
    ]);
    setNewTask("");
  };

  const deleteTask = (id) => {
    if (window.confirm("Delete this task?"))
      setTasks(tasks.filter((t) => t.id !== id));
  };

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

  // --- Enhanced: Assign person + automatic log entry ---
  const assignPerson = (taskId, personName) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          const previousAssignee = t.assignedTo || "Unassigned";
          const newAssignee = personName || "Unassigned";
          const now = getCurrentTime();

          const updatedLog = [...(t.logEntries || [])];
          if (previousAssignee !== newAssignee) {
            updatedLog.push({
              text: `Assignee changed from ${previousAssignee} to ${newAssignee}.`,
              date: now,
            });
          }

          return {
            ...t,
            assignedTo: personName,
            status: personName ? "In Progress" : "Not Started",
            timestamp: now,
            logEntries: updatedLog,
          };
        }
        return t;
      })
    );
    setOpenTaskId(null);
  };

  // --- Template handling ---
  const addTemplate = () => {
    if (!popupTask || !templateName.trim()) return;
    const safeUrl = templateUrl.trim();
    const now = getCurrentTime();
    const updatedTasks = tasks.map((t) => {
      if (t.id === popupTask.id) {
        const newTemplate = {
          id: Date.now(),
          name: templateName,
          url: safeUrl,
          date: now,
          reviewStatus: "Pending",
        };
        return { ...t, templates: [...(t.templates || []), newTemplate] };
      }
      return t;
    });
    setTasks(updatedTasks);
    setTemplateName("");
    setTemplateUrl("");
  };

  const removeTemplate = (taskId, templateId) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? { ...t, templates: t.templates.filter((tpl) => tpl.id !== templateId) }
          : t
      )
    );
  };

  // --- Popup open/save ---
  const openPopup = (task) => {
    setPopupTask(task);
    setPurpose(task.purpose || "");
    setNewLogEntry("");
    setNewLogLink("");
    setTemplateName("");
    setTemplateUrl("");
  };

  const saveAndClosePopup = () => {
    if (!popupTask) return;
    const entryText = newLogEntry.trim();
    const entryLink = newLogLink.trim();
    const updatedPurpose = purpose.trim();

    const updatedTasks = tasks.map((t) => {
      if (t.id !== popupTask.id) return t;
      const changesMade =
        t.purpose !== updatedPurpose || entryText !== "" || entryLink !== "";

      if (!changesMade) return t;

      const updatedLog = [...(t.logEntries || [])];
      if (entryText !== "" || entryLink !== "") {
        updatedLog.push({
          text: entryText,
          link: entryLink,
          date: getCurrentTime(),
        });
      }

      return {
        ...t,
        purpose: updatedPurpose,
        logEntries: updatedLog,
        timestamp: getCurrentTime(),
      };
    });

    setTasks(updatedTasks);
    setPopupTask(null);
  };

  // --- Hover handling ---
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
                  title="Click to view or edit task"
                >
                  <span className="task-text">{task.text}</span>
                </div>

                <div className="task-controls" style={{ position: "relative" }}>
                  <button className="status-btn" onClick={() => cycleStatus(task.id)}>
                    {task.status}
                  </button>

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

      {/* Popup */}
      {popupTask && (
        <div className="popup-overlay" onClick={saveAndClosePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-title">{popupTask.text}</div>

            {/* Display current assignee */}
            <div className="popup-assignee">
              <strong>Assigned to:</strong>{" "}
              {popupTask.assignedTo || "Unassigned"}
            </div>

            <label className="popup-subheader">PURPOSE</label>
            <textarea
              className="popup-purpose"
              placeholder="Define task purpose..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={2}
            />

            <hr className="popup-divider" />

            {/* Log section */}
            <div className="popup-log-section">
              <label className="popup-subheader">LOG HISTORY</label>
              <div className="popup-log-history">
                {popupTask.logEntries && popupTask.logEntries.length > 0 ? (
                  popupTask.logEntries.map((entry, idx) => (
                    <div key={idx} className="popup-log-entry">
                      <span className="popup-log-date">{entry.date}</span>
                      <div className="popup-log-text">{entry.text}</div>
                      {entry.link && (
                        <a
                          href={entry.link.startsWith("http") ? entry.link : `https://${entry.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="popup-log-link"
                        >
                          📄 View Document
                        </a>
                      )}
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
              <input
                type="url"
                placeholder="Optional document link"
                value={newLogLink}
                onChange={(e) => setNewLogLink(e.target.value)}
                style={{
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  padding: "6px",
                  marginTop: "6px",
                  fontSize: "0.9rem",
                }}
              />
            </div>

            {/* Templates section */}
            <div className="popup-template-section" style={{ marginTop: "14px" }}>
              <label className="popup-subheader">TEMPLATES</label>
              <input
                type="text"
                placeholder="Template name..."
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                style={{
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  padding: "6px",
                  marginBottom: "6px",
                  fontSize: "0.9rem",
                }}
              />
              <input
                type="url"
                placeholder="Template link (URL)..."
                value={templateUrl}
                onChange={(e) => setTemplateUrl(e.target.value)}
                style={{
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  padding: "6px",
                  marginBottom: "6px",
                  fontSize: "0.9rem",
                }}
              />
              <button className="add" style={{ marginBottom: "8px" }} onClick={addTemplate}>
                ➕ Add Template
              </button>

              <div className="popup-template-list">
                {popupTask.templates && popupTask.templates.length > 0 ? (
                  popupTask.templates.map((tpl) => (
                    <div key={tpl.id} className="popup-template-item">
                      <Paperclip size={14} style={{ marginRight: "6px" }} />
                      <a
                        href={tpl.url.startsWith("http") ? tpl.url : `https://${tpl.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {tpl.name || "Untitled Template"}
                      </a>
                      <span style={{ fontSize: "0.8rem", color: "#666", marginLeft: "6px" }}>
                        ({tpl.date}) – {tpl.reviewStatus}
                      </span>
                      <button
                        className="delete"
                        style={{ marginLeft: "8px" }}
                        onClick={() => removeTemplate(popupTask.id, tpl.id)}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="popup-log-empty">No templates linked yet.</div>
                )}
              </div>
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
