/* === METRA – TaskPopupChangeTest.jsx
   Phase 9.7-E Step 2 – Change Request Panel with Scope + Note Field
   --------------------------------------------------------------
   Adds Internal/PMO scope selector and text area within the popup.
   Behaviour is non-persistent (for layout and interaction testing only).
*/

import React, { useEffect, useState } from "react";
import "../Styles/TaskPopupChangeTest.css";

const TaskPopupChangeTest = ({ task, onClose }) => {
  const [showChangeRequest, setShowChangeRequest] = useState(false);
  const [scope, setScope] = useState("Internal");
  const [note, setNote] = useState("");

  if (!task) return null;

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains("popup-overlay")) onClose();
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [onClose]);

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3 className="popup-title">Change Control Task</h3>

        <p className="popup-line">
          <strong>Task:</strong> {task.text}
        </p>
        <p className="popup-line">
          <strong>Timestamp:</strong> {task.timestamp}
        </p>

        {/* === Change Request Button === */}
        <button
          className="popup-change-btn"
          onClick={() => setShowChangeRequest(!showChangeRequest)}
          style={{
            marginTop: "8px",
            padding: "6px 12px",
            backgroundColor: "#0057b8",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          📋 Change Request
        </button>

        {/* === Change Request Panel (New Section) === */}
        {showChangeRequest && (
          <div
            className="popup-change-panel"
            style={{
              marginTop: "14px",
              backgroundColor: "#f7f7f7",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "12px",
            }}
          >
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "6px",
                color: "#0a2b5c",
              }}
            >
              Request Scope:
            </label>

            {/* === Internal / PMO Toggle === */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <button
                onClick={() => setScope("Internal")}
                style={{
                  flex: 1,
                  padding: "6px 0",
                  borderRadius: "6px",
                  border:
                    scope === "Internal" ? "2px solid #0057b8" : "1px solid #ccc",
                  backgroundColor:
                    scope === "Internal" ? "#e3ecf7" : "#ffffff",
                  cursor: "pointer",
                  fontWeight: scope === "Internal" ? "600" : "400",
                }}
              >
                Internal
              </button>
              <button
                onClick={() => setScope("PMO")}
                style={{
                  flex: 1,
                  padding: "6px 0",
                  borderRadius: "6px",
                  border:
                    scope === "PMO" ? "2px solid #0057b8" : "1px solid #ccc",
                  backgroundColor: scope === "PMO" ? "#e3ecf7" : "#ffffff",
                  cursor: "pointer",
                  fontWeight: scope === "PMO" ? "600" : "400",
                }}
              >
                PMO
              </button>
            </div>

            {/* === Text Area for Change Note === */}
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "4px",
                color: "#0a2b5c",
              }}
            >
              Change Request Note:
            </label>
            <textarea
              placeholder="Enter change description..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "6px",
                fontSize: "0.9rem",
                resize: "vertical",
                backgroundColor: "#fff",
              }}
            />

            {/* === Non-functional message === */}
            <p
              style={{
                marginTop: "8px",
                fontStyle: "italic",
                color: "#666",
                fontSize: "0.85rem",
              }}
            >
              (Entries are not yet saved – layout verification only)
            </p>
          </div>
        )}

        <button className="popup-close" onClick={onClose}>
          × Close
        </button>
      </div>
    </div>
  );
};

export default TaskPopupChangeTest;
