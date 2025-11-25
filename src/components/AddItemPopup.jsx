/* =============================================================================
   METRA – AddItemPopup.jsx
   Clean Rebuild – Guaranteed Valid JSX
   ============================================================================= */

import React, { useState } from "react";
import "../Styles/AddItemPopup.css";

export default function AddItemPopup({
  visible,
  onClose,
  onCreateItem,
  summaries
}) {
  if (!visible) return null;

  const [title, setTitle] = useState("");
  const [itemClass, setItemClass] = useState("management");
  const [itemType, setItemType] = useState("summary");
  const [taskRelationship, setTaskRelationship] = useState("independent");
  const [selectedSummary, setSelectedSummary] = useState("");

  const handleCreate = () => {
    if (!title.trim()) return;

    const newItem = {
      id: Date.now(),
      title: title.trim(),
      itemClass,
      itemType,
      expanded: itemType === "summary",
      parentId:
        itemType === "task" &&
        taskRelationship === "linked" &&
        selectedSummary
          ? Number(selectedSummary)
          : null,
      assignedPerson: null,
      status: itemType === "task" ? "Not Started" : "Summary",
      entries: []
    };

    onCreateItem(newItem);
    onClose();
  };

  const filteredSummaries = summaries.filter(
    (s) => s.itemClass === itemClass
  );

  return (
    <div className="additem-backdrop">
      <div className="additem-container">

        {/* HEADER */}
        <div className="additem-header">
          <span>Create New Item</span>
          <button className="additem-close" onClick={onClose}>×</button>
        </div>

        {/* BODY */}
        <div className="additem-body">

          {/* TITLE */}
          <label className="additem-label">Title</label>
          <input
            className="additem-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title..."
          />

          {/* ITEM CLASS */}
          <label className="additem-label">Item Class</label>
          <div className="additem-row">
            <label className="additem-radio">
              <input
                type="radio"
                name="itemClass"
                value="management"
                checked={itemClass === "management"}
                onChange={() => setItemClass("management")}
              />
              Management
            </label>

            <label className="additem-radio">
              <input
                type="radio"
                name="itemClass"
                value="development"
                checked={itemClass === "development"}
                onChange={() => setItemClass("development")}
              />
              Development
            </label>
          </div>

          {/* ITEM TYPE */}
          <label className="additem-label">Item Type</label>
          <div className="additem-row">
            <label className="additem-radio">
              <input
                type="radio"
                name="itemType"
                value="summary"
                checked={itemType === "summary"}
                onChange={() => setItemType("summary")}
              />
              Summary
            </label>

            <label className="additem-radio">
              <input
                type="radio"
                name="itemType"
                value="task"
                checked={itemType === "task"}
                onChange={() => setItemType("task")}
              />
              Task
            </label>
          </div>

          {/* TASK RELATIONSHIP */}
          {itemType === "task" && (
            <>
              <label className="additem-label">Task Relationship</label>
              <div className="additem-row">
                <label className="additem-radio">
                  <input
                    type="radio"
                    name="relationship"
                    value="independent"
                    checked={taskRelationship === "independent"}
                    onChange={() => {
                      setTaskRelationship("independent");
                      setSelectedSummary("");
                    }}
                  />
                  Independent
                </label>

                <label className="additem-radio">
                  <input
                    type="radio"
                    name="relationship"
                    value="linked"
                    checked={taskRelationship === "linked"}
                    onChange={() => setTaskRelationship("linked")}
                  />
                  Linked to Summary
                </label>
              </div>

              {/* SUMMARY SELECTOR */}
              {taskRelationship === "linked" && (
                <div className="additem-summary-box">
                  {filteredSummaries.length === 0 ? (
                    <div className="additem-nosummary">
                      No summaries available in this class.
                      <br />
                      Task will be independent.
                    </div>
                  ) : (
                    <>
                      <label className="additem-label">Choose Summary</label>
                      <select
                        className="additem-select"
                        value={selectedSummary}
                        onChange={(e) => setSelectedSummary(e.target.value)}
                      >
                        <option value="">Select…</option>
                        {filteredSummaries.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
              )}
            </>
          )}

        </div>

        {/* FOOTER */}
        <div className="additem-footer">
          <button className="additem-btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="additem-btn create" onClick={handleCreate}>
            Create
          </button>
        </div>

      </div>
    </div>
  );
}
