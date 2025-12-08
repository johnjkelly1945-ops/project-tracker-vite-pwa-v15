/* ======================================================================
   METRA – TaskRepositorySandbox.jsx
   ----------------------------------------------------------------------
   Purpose:
   • Safe standalone environment for testing TaskRepository.jsx
   • Does NOT touch live workspace or real task data
   • Can be enabled/disabled in App.jsx without any risk
   ====================================================================== */

import React, { useState } from "react";
import TaskRepository from "./TaskRepository.jsx";
import "../Styles/TaskRepository.css";

export default function TaskRepositorySandbox() {
  const [open, setOpen] = useState(true);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "#eef2f7",
        padding: "40px",
      }}
    >
      <h1 style={{ fontSize: "26px", marginBottom: "20px" }}>
        Task Repository – Sandbox Mode
      </h1>

      <p style={{ marginBottom: "20px", color: "#444" }}>
        This is a safe testing environment. Actions here do NOT affect the real
        METRA workspace or saved tasks.
      </p>

      {open && (
        <TaskRepository
          onClose={() => setOpen(false)}
          onAddToWorkspace={(selected) => {
            console.log("SANDBOX RESULT:", selected);
            alert(
              "Sandbox: Selected items logged to console.\nThis does NOT change your real workspace."
            );
          }}
        />
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            background: "#1e3a8a",
            color: "white",
            borderRadius: "6px",
            border: "none",
            marginTop: "20px",
          }}
        >
          Reopen Repository Sandbox
        </button>
      )}
    </div>
  );
}
