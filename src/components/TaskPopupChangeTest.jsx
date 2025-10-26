/* === METRA – TaskPopupChangeTest.jsx
   Phase 9.8C – Inline ✔ Saved Indicator & Layout Stabilisation
   -------------------------------------------------------------
   ✔ Appears next to Start/Complete button for 2.5 s.
   🧱 Fixed popup wobble.
   ➕ Disabled ‘Add Step’ placeholder added (bottom of list).
*/

import React, { useEffect, useState } from "react";
import "../Styles/TaskPopupChangeTest.css";
import { CheckCircle } from "lucide-react";

const TaskPopupChangeTest = ({ task, onClose }) => {
  const [activeTab, setActiveTab] = useState("Change");
  const [miniTasks, setMiniTasks] = useState([
    { id: 1, text: "Impact Assessment", status: "Not Started", timestamp: "", showSaved: false },
    { id: 2, text: "Board Review", status: "Not Started", timestamp: "", showSaved: false },
    { id: 3, text: "Implementation Verification", status: "Not Started", timestamp: "", showSaved: false },
  ]);

  // Load saved mini-tasks
  useEffect(() => {
    const stored = localStorage.getItem("metraChangeMiniTasks");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setMiniTasks(parsed);
      } catch (e) {
        console.error("Error reading saved Change mini-tasks:", e);
      }
    }
  }, []);

  const triggerSave = (updated, id) => {
    setMiniTasks(updated);
    localStorage.setItem("metraChangeMiniTasks", JSON.stringify(updated));

    // show inline ✔ Saved
    setMiniTasks((prev) =>
      prev.map((mt) =>
        mt.id === id ? { ...mt, showSaved: true } : { ...mt, showSaved: false }
      )
    );
    setTimeout(() => {
      setMiniTasks((prev) => prev.map((mt) => ({ ...mt, showSaved: false })));
    }, 2500);
  };

  const toggleStatus = (id, newStatus) => {
    const now = new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
    const updated = miniTasks.map((mt) =>
      mt.id === id ? { ...mt, status: newStatus, timestamp: now } : mt
    );
    triggerSave(updated, id);
  };

  const getStatusColor = (status) => {
    if (status === "Completed") return "#3aa655";
    if (status === "In Progress") return "#e3b341";
    return "#888";
  };

  if (!task) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box stable" onClick={(e) => e.stopPropagation()}>
        <h3 className="popup-title">Change Control Task</h3>

        <div className="process-tabs">
          {["Change", "Risk", "Issue", "Quality"].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Change" && (
          <div className="mini-task-section">
            {miniTasks.map((mt) => (
              <div key={mt.id} className="mini-task-row">
                <div className="mini-task-info">
                  <span className="mini-task-text">{mt.text}</span>
                  <span
                    className="mini-task-status"
                    style={{ color: getStatusColor(mt.status) }}
                  >
                    {mt.status}
                  </span>
                  <span className="mini-task-time">{mt.timestamp}</span>
                </div>

                <div className="mini-task-actions">
                  {mt.status === "Not Started" && (
                    <button
                      className="mini-btn start"
                      onClick={() => toggleStatus(mt.id, "In Progress")}
                    >
                      ▶ Start
                    </button>
                  )}
                  {mt.status === "In Progress" && (
                    <button
                      className="mini-btn complete"
                      onClick={() => toggleStatus(mt.id, "Completed")}
                    >
                      ✔ Complete
                    </button>
                  )}
                  {mt.status === "Completed" && (
                    <button
                      className="mini-btn reset"
                      onClick={() => toggleStatus(mt.id, "Not Started")}
                    >
                      ↺ Reset
                    </button>
                  )}

                  {/* Inline ✔ Saved */}
                  {mt.showSaved && (
                    <span className="inline-saved">
                      <CheckCircle size={14} color="#3aa655" /> Saved
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Add Step placeholder */}
            <div className="mini-task-add">
              <button className="mini-btn add-disabled" disabled>
                ➕ Add Step (coming soon)
              </button>
            </div>
          </div>
        )}

        {activeTab !== "Change" && (
          <div className="coming-soon">
            {activeTab} process integration coming in Phase 9.8D
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
