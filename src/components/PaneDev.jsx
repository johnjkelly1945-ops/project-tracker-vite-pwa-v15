import React from "react";

export default function PaneDev() {
  return (
    <div className="task-list">
      {[...Array(50)].map((_, i) => (
        <div className="task-item" key={i}>Development Task {i + 1}</div>
      ))}
    </div>
  );
}
