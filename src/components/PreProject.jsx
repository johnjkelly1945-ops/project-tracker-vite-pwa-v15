import React, { useState, useEffect } from "react";
import "../Styles/Checklist.css";

export default function PreProject() {
  const [tasks, setTasks] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem("preproject-tasks");
    return saved
      ? JSON.parse(saved)
      : [
          { text: "Cost benefit analysis completed", status: "Not started" },
          { text: "Feasibility study approved", status: "Not started" },
          { text: "Project charter signed", status: "Not started" }
        ];
  });

  const [newTask, setNewTask] = useState("");

  // Save tasks whenever they change
  useEffect(() => {
    localStorage.setItem("preproject-tasks", JSON.stringify(tasks));
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
      <h2>Pre-Project Planning</h2>
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
