/* ======================================================================
   METRA – TaskItem.jsx
   Phase 4.6 B.12 Step 2B – Summary Task Group Visual Verification
   ----------------------------------------------------------------------
   • Renders both summary (parent) and normal (child) tasks
   • Applies royal-blue .summary-task style to summary rows
   • Nested subtasks indented beneath each summary
   • Non-intrusive – leaves popup / audit / hover logic untouched
   ====================================================================== */

import React from "react";
import "../styles/Checklist.css";

const TaskItem = ({ task }) => {
  if (!task) return null;

  const isSummary =
    task.isSummary || (Array.isArray(task.subTasks) && task.subTasks.length > 0);

  const taskClass = isSummary
    ? "task-item summary-task"
    : "task-item status-in-progress";

  return (
    <li className={taskClass}>
      <div className="task-text-area">
        {isSummary && <span className="summary-arrow">▸</span>}
        <span className="task-text">{task.title || task.projectName}</span>
      </div>

      {/* === Render Subtasks (Indented) === */}
      {isSummary && Array.isArray(task.subTasks) && (
        <ul style={{ marginLeft: "1.5rem", marginTop: "0.2rem" }}>
          {task.subTasks.map((sub, idx) => (
            <TaskItem key={idx} task={sub} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default TaskItem;
