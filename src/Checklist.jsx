import React, { useState } from "react";
import "./Checklist.css";

export default function Checklist({ title, items }) {
  const [tasks, setTasks] = useState(items);

  const updateStatus = (index, newStatus) => {
    const updated = [...tasks];
    updated[index].status = newStatus;
    setTasks(updated);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const addTask = (text) => {
    if (text.trim()) {
      setTasks([...tasks, { text, status: "Not started" }]);
    }
  };

  return (
    <div className="checklist">
      <h2>{title}</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={index} className={`status-${task.status.toLowerCase().replace(" ", "-")}`}>
            <span>{task.text}</span>
            <select
              value={task.status}
              onChange={(e) => updateStatus(index, e.target.value)}
            >
              <option>Not started</option>
              <option>In progress</option>
              <option>Completed</option>
            </select>
            <button onClick={() => deleteTask(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <AddTaskForm onAdd={addTask} />
    </div>
  );
}

function AddTaskForm({ onAdd }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(value);
    setValue("");
  };

  return (
    <form className="add-task" onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a new task..."
      />
      <button type="submit">Add</button>
    </form>
  );
}
