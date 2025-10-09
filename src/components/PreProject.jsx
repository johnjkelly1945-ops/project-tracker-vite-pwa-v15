import { useEffect, useState } from "react";
import "../Styles/Checklist.css";

export default function PreProject() {
  const storageKey = "preprojectTasks";
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Load saved tasks (safe parse)
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setTasks(parsed);
      } catch {
        // Ignore bad data; keep empty
      }
    }
  }, []);

  // Save tasks on change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const text = newTask.trim();
    if (!text) return;
    setTasks((prev) => [
      ...prev,
      {
        text,
        status: "Not started",
        timestamp: new Date().toLocaleString(),
      },
    ]);
    setNewTask("");
  };

  const updateStatus = (index, status) => {
    setTasks((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        status,
        timestamp: new Date().toLocaleString(),
      };
      return copy;
    });
  };

  const deleteTask = (index) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const statusClass = (status) => {
    if (status === "Completed") return "status-completed";
    if (status === "In progress") return "status-in-progress";
    return "status-not-started";
  };

  return (
    <div className="checklist-container">
      <h2>Pre-Project Checklist</h2>

      <div className="task-input">
        <input
          type="text"
          placeholder="Add new pre-project task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="add-btn" onClick={addTask}>Add Task</button>
      </div>

      <ul className="checklist">
        {tasks.map((task, i) => (
          <li key={i} className={`checklist-item ${statusClass(task.status)}`}>
            <div className="task-row">
              <span
                className={`task-text ${
                  task.status === "Completed" ? "done" : ""
                }`}
                title={task.text}
              >
                {task.text}
              </span>

              <div className="controls">
                <select
                  value={task.status}
                  onChange={(e) => updateStatus(i, e.target.value)}
                >
                  <option>Not started</option>
                  <option>In progress</option>
                  <option>Completed</option>
                </select>

                <button className="delete-btn" onClick={() => deleteTask(i)}>
                  Delete
                </button>
              </div>
            </div>

            <div className="timestamp">Last updated: {task.timestamp}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
