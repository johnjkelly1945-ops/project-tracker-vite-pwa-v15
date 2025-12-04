import React, { useState, useEffect } from "react";
import "../Styles/Checklist.css";

export default function Progress() {
  const storageKey = "progressTasks";

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved
      ? JSON.parse(saved)
      : [
          { text: "Requirements gathered", status: "Not started" },
          { text: "Timeline created", status: "Not started" },
          { text: "Resources allocated", status: "Not started" }
        ];
  });

  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { text: newTask, status: "Not started" }]);
    setNewTask("");
  };

  const deleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  const changeStatus = (index, newStatus) => {
    const updated = [...tasks];
    updated[index].status = newStatus;
    setTasks(updated);
  };

  return (
    <div className="checklist">
      <h2>Progress</h2>
      <ul>
        {tasks.map((task, i) => (
          <li
            key={i}
            className={
              task.status === "Not started"
                ? "status-not-started"
                : task.status === "In progress"
                ? "status-in-progress"
                : "status-completed"
            }
          >
            {task.text}
            <div>
              <select
                value={task.status}
                onChange={(e) => changeStatus(i, e.target.value)}
              >
                <option>Not started</option>
                <option>In progress</option>
                <option>Completed</option>
              </select>
              <button className="delete-btn" onClick={() => deleteTask(i)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="add-task">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task"
        />
        <button onClick={addTask}>Add</button>
      </div>
    </div>
  );
}
