import React, { useState } from "react";

export default function TaskList({ tasks, addTask, toggleDone }) {
  const [newTask, setNewTask] = useState("");

  const handleAdd = () => {
    if (!newTask.trim()) return;
    addTask(newTask);
    setNewTask("");
  };

  return (
    <div className="task-list box">
      <h2>Tasks</h2>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleDone(t.id)}
            />
            {t.name}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New task"
      />
      <button onClick={handleAdd}>Add Task</button>
    </div>
  );
}
