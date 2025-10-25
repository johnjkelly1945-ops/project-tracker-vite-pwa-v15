/* === METRA – TaskPopupChangeTest.jsx
   Phase 9.7-E Step 3 – Temporary Persistence + Attachment Field
   -------------------------------------------------------------
   Enhances the Change Request panel:
   - Keeps scope and note active while popup is open
   - Adds document attachment input (URL or link)
   - Still non-persistent across sessions
*/

import React, { useEffect, useState } from "react";
import "../Styles/TaskPopupChangeTest.css";

const TaskPopupChangeTest = ({ task, onClose }) => {
  const [showChangeRequest, setShowChangeRequest] = useState(false);
  const [scope, setScope] = useState("Internal");
  const [note, setNote] = useState("");
  const [attachment, setAttachment] = useState("");

  if (!task) return null;

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains("popup-overlay")) onClose();
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [onClose]);

  // --- Temporary state persistence while open (handled by React) ---
  const handleScopeChange = (value) => setScope(value);
  const handleNoteChange = (e) => setNote(e.target.value);
  const handleAttachmentChange = (e) => setAttachment(e.target.value);

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

        {/* === Change Request Panel === */}
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
            {/* Scope Selector */}
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
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              {["Internal", "PMO"].map((option) => (
                <button
                  key={option}
                  onClick={() => handleScopeChange(option)}
                  style={{
                    flex: 1,
                    padding: "6px 0",
                    borderRadius: "6px",
                    border:
                      scope === option ? "2px solid #0057b8" : "1px solid #ccc",
                    backgroundColor:
                      scope === option ? "#e3ecf7" : "#ffffff",
                    cursor: "pointer",
                    fontWeight: scope === option ? "600" : "400",
                    transition: "all 0.2s ease",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Change Request Note */}
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
              onChange={handleNoteChange}
              rows={3}
              style={{
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "6px",
                fontSize: "0.9rem",
                resize: "vertical",
                backgroundColor: "#fff",
                marginBottom: "10px",
              }}
            />

            {/* Attachment Field */}
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "4px",
                color: "#0a2b5c",
              }}
            >
              Attach Document (optional):
            </label>
            <input
              type="url"
              placeholder="Paste document URL or link..."
              value={attachment}
              onChange={handleAttachmentChange}
              style={{
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "6px",
                fontSize: "0.9rem",
              }}
            />

            <p
              style={{
                marginTop: "8px",
                fontStyle: "italic",
                color: "#666",
                fontSize: "0.85rem",
              }}
            >
              (All fields are temporary – will reset when popup closes)
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
