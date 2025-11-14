/* ======================================================================
   METRA – PersonnelDetail.jsx
   Step 7 – Modal on Top of Popup (Guaranteed z-index)
   ====================================================================== */

import React from "react";

export default function PersonnelDetail({ personName, allTasks, onClose }) {

  if (!personName) return null;

  /* All tasks assigned to this person */
  const tasksForPerson = allTasks.filter(
    (t) => t.assigned && t.assigned === personName
  );

  return (
    <div
      className="pd-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 9999,           // GUARANTEED to be above Task Popup
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        className="pd-card"
        style={{
          background: "#fff",
          padding: "20px",
          width: "420px",
          maxHeight: "80vh",
          overflowY: "auto",
          borderRadius: "12px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
          color: "#111"
        }}
      >

        <h2
          className="pd-title"
          style={{ fontSize: "1.4rem", marginBottom: "14px" }}
        >
          {personName}
        </h2>

        {/* List of tasks for this person */}
        <div className="pd-tasklist">
          {tasksForPerson.length > 0 ? (
            tasksForPerson.map((t) => (
              <div
                key={t.id}
                className="pd-task"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: "1px solid #ddd"
                }}
              >
                <span className="pd-task-title" style={{ fontWeight: 500 }}>
                  {t.title}
                </span>
                <span className="pd-task-status" style={{ color: "#555" }}>
                  {t.status}
                </span>
              </div>
            ))
          ) : (
            <div
              className="pd-empty"
              style={{
                padding: "10px",
                color: "#666",
                textAlign: "center"
              }}
            >
              No tasks assigned.
            </div>
          )}
        </div>

        <button
          className="pd-close-btn"
          onClick={onClose}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "20px",
            background: "#e5e7eb",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          Close
        </button>

      </div>
    </div>
  );
}
