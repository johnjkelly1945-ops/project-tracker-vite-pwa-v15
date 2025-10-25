/* === METRA – Change Control Sandbox (Phase 9.5)
   Popup Overlay Reintegration – PreProjectChangeTest.jsx
   ------------------------------------------------------
   Builds on Phase 9.4 diagnostic baseline.
   Adds popup overlay functionality using TaskPopupChangeTest.jsx.
*/

import React, { useEffect, useState } from "react";
import TaskPopupChangeTest from "./TaskPopupChangeTest.jsx";
import "../Styles/TaskPopupChangeTest.css";

const PreProjectChangeTest = () => {
  const [selectedTask, setSelectedTask] = useState(null);

  const tasks = [
    { text: "Site Survey Preparation", timestamp: "2025-10-22 10:15" },
    { text: "Cable Routing Review", timestamp: "2025-10-22 11:00" },
    { text: "Document Control Alignment", timestamp: "2025-10-22 11:45" },
  ];

  useEffect(() => {
    console.log("✅ PreProjectChangeTest mounted – React is active (Phase 9.5)");
  }, []);

  const handleTaskClick = (task) => {
    console.log("🟦 Click detected for:", task.text);
    setSelectedTask(task);
    console.log("📦 selectedTask now set to:", task);
  };

  const handleClosePopup = () => {
    console.log("❎ Popup close triggered");
    setSelectedTask(null);
  };

  console.log("🔄 Render phase – selectedTask =", selectedTask);

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "60px auto",
        padding: "20px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 0 12px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          color: "#0a2b5c",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        🔍 Change Control – Popup Integration Test
      </h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task, index) => (
          <li
            key={index}
            onClick={() => handleTaskClick(task)}
            style={{
              padding: "12px 10px",
              marginBottom: "10px",
              backgroundColor: "#f0f4fa",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#e3ecf7")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#f0f4fa")
            }
          >
            <span style={{ fontSize: "16px", color: "#222" }}>{task.text}</span>
            <span style={{ fontSize: "13px", color: "gray" }}>
              {task.timestamp}
            </span>
          </li>
        ))}
      </ul>

      <p
        style={{
          textAlign: "center",
          marginTop: "25px",
          color: "#666",
          fontSize: "14px",
        }}
      >
        Click any task to open its popup overlay.
      </p>

      {/* Popup overlay mount */}
      {selectedTask && (
        <TaskPopupChangeTest task={selectedTask} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default PreProjectChangeTest;
