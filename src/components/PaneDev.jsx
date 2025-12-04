import React from "react";

export default function PaneDev({ tasks, onTaskClick }) {
  return (
    <div className="pane">

      {/* Sticky Header */}
      <div className="pane-header">
        Development Tasks
      </div>

      {/* Scrollable Body */}
      <div className="pane-content">
        {tasks?.map((t) => (
          <div
            key={t.id}
            className="task-row"
            onClick={() => onTaskClick(t)}
          >
            <div>{t.title}</div>
            <div className="task-status">{t.status}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
