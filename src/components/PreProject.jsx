import { useState, useEffect } from "react";
import "../Styles/Checklist.css";

export default function PreProject() {
  const storageKey = "preprojectTasks";
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState("");

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks]);

  // === Add new task ===
  const addTask = () => {
    if (!newTask.trim()) return;
    const timestamp = new Date().toLocaleString("en-GB");
    const newEntry = {
      id: Date.now(),
      text: newTask.trim(),
      status: "Not Started",
      timestamp,
    };
    setTasks([...tasks, newEntry]);
    setNewTask("");
  };

  // === Delete a task ===
  const deleteTask = (id) => {
    if (window.confirm("Delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  // === Cycle status + update timestamp ===
  const cycleStatus = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          let newStatus;
          if (task.status === "Not Started") newStatus = "In Progress";
          else if (task.status === "In Progress") newStatus = "Completed";
          else newStatus = "Not Started";

          // Update timestamp to show latest change
          const updatedTime = new Date().toLocaleString("en-GB");
          return { ...task, status: newStatus, timestamp: updatedTime };
        }
        return task;
      })
    );
  };

  // === Status colours ===
  const getStatusClass = (status) => {
    if (status === "In Progress") return "status-in-progress";
    if (status === "Completed") return "status-completed";
    return "status-not-started";
  };

  // === Render ===
  return (
    <div className="checklist-container">
      <header className="top-header">
        <h2>Pre-Project Checklist</h2>
      </header>

      <div className="checklist">
        <ul>
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`task-item ${getStatusClass(task.status)}`}
            >
              <div className="task-text-area">
                <span className="task-text">{task.text}</span>
              </div>

              <div className="task-controls">
                <button
                  className="status-btn"
                  onClick={() => cycleStatus(task.id)}
                  title="Click to change status"
                >
                  {task.status}
                </button>

                <span className="timestamp">{task.timestamp}</span>

                <button className="delete" onClick={() => deleteTask(task.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}

          {/* Add-task input row */}
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
