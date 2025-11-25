/* =============================================================================
   METRA – PreProject.jsx
   v6.1 – Remove Old In-Pane Add Buttons + Sticky Footer Only
   -----------------------------------------------------------------------------
   FEATURES:
   • Unified item array (Summaries + Tasks, Mgmt + Dev)
   • Summary expand/collapse
   • Independent tasks + summary-linked tasks
   • NEW: Removed old button bar inside panes
   • Sticky bottom footer now the only add-entry point
   • AddItemPopup integration
   • DualPane management/development filtering
   • TaskPopup v5.3 preserved
   • PersonnelOverlay preserved
   • LocalStorage save/load
   ============================================================================= */

import React, { useState, useEffect } from "react";
import TaskPopup from "./TaskPopup.jsx";
import PersonnelOverlay from "./PersonnelOverlay.jsx";
import AddItemPopup from "./AddItemPopup.jsx";

import "../Styles/PreProject.css";

export default function PreProject() {

  /* ---------------------------------------------------------------------------
     LOAD / SAVE – unified array
  --------------------------------------------------------------------------- */
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("items_v6");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("items_v6", JSON.stringify(items));
  }, [items]);

  /* ---------------------------------------------------------------------------
     POPUP + OVERLAY STATE (TaskPopup + Personnel)
  --------------------------------------------------------------------------- */
  const [popupVisible, setPopupVisible] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  const lockScroll = () => (document.body.style.overflow = "hidden");
  const unlockScroll = () => (document.body.style.overflow = "");

  const openTaskPopup = (task) => {
    setActiveTask(task);
    setPopupVisible(true);
    lockScroll();
  };

  const closeTaskPopup = () => {
    setPopupVisible(false);
    setActiveTask(null);
    setOverlayVisible(false);
    unlockScroll();
  };

  const handleChangePerson = () => setOverlayVisible(true);

  const handlePersonSelected = (name) => {
    if (!activeTask) return;

    const timestamp = new Date().toLocaleString();

    const updated = items.map((i) => {
      if (i.id !== activeTask.id) return i;

      return {
        ...i,
        assignedPerson: name,
        status: "In Progress",
        entries: [...i.entries, `• Assigned to ${name} – ${timestamp}`],
      };
    });

    setItems(updated);

    const refreshed = updated.find((x) => x.id === activeTask.id);
    setActiveTask(refreshed);

    setOverlayVisible(false);
  };

  /* ---------------------------------------------------------------------------
     ADD ITEM POPUP STATE
  --------------------------------------------------------------------------- */
  const [addPopupVisible, setAddPopupVisible] = useState(false);

  const openAddPopup = (mode) => {
    setAddPopupVisible(true);
    lockScroll();
  };

  const closeAddPopup = () => {
    setAddPopupVisible(false);
    unlockScroll();
  };

  const handleCreateItem = (newItem) => {
    const updated = [...items, newItem];
    setItems(updated);
  };

  /* ---------------------------------------------------------------------------
     SUMMARY TOGGLE
  --------------------------------------------------------------------------- */
  const toggleSummary = (sum) => {
    const updated = items.map((i) => {
      if (i.id !== sum.id) return i;
      return { ...i, expanded: !i.expanded };
    });
    setItems(updated);
  };

  /* ---------------------------------------------------------------------------
     FILTER FOR LEFT (Management) + RIGHT (Development)
  --------------------------------------------------------------------------- */
  const managementItems = items.filter((i) => i.itemClass === "management");
  const developmentItems = items.filter((i) => i.itemClass === "development");

  const getChildren = (summary) =>
    items.filter((i) => i.parentId === summary.id);

  /* ---------------------------------------------------------------------------
     RENDER HELPERS
  --------------------------------------------------------------------------- */
  const renderItem = (item) => {
    const isSummary = item.itemType === "summary";

    if (isSummary) {
      return (
        <div key={item.id} className="pp-summary-row">
          <div className="pp-summary-left">
            <span
              className="pp-summary-chevron"
              onClick={() => toggleSummary(item)}
            >
              {item.expanded ? "▾" : "▸"}
            </span>
            <span className="pp-summary-dot"></span>
            <span className="pp-summary-title">{item.title}</span>
          </div>
        </div>
      );
    }

    // TASK ROW
    return (
      <div
        key={item.id}
        className="pp-task-row"
        onClick={() => openTaskPopup(item)}
      >
        <span className="pp-task-dot"></span>
        <span className="pp-task-title">{item.title}</span>
      </div>
    );
  };

  const renderPane = (paneItems) => {
    return (
      <div className="pp-pane">
        {paneItems.map((item) => {
          if (item.itemType === "summary") {
            return (
              <React.Fragment key={item.id}>
                {renderItem(item)}
                {item.expanded &&
                  getChildren(item).map((child) => renderItem(child))}
              </React.Fragment>
            );
          }

          if (item.itemType === "task" && !item.parentId) {
            return renderItem(item);
          }

          return null;
        })}
      </div>
    );
  };

  /* ---------------------------------------------------------------------------
     MAIN RENDER
  --------------------------------------------------------------------------- */
  return (
    <div className="preproject-container">

      {/* POPUP: TASK */}
      <TaskPopup
        visible={popupVisible}
        task={activeTask}
        onClose={closeTaskPopup}
        onChangePerson={handleChangePerson}
      />

      {/* POPUP: PERSONNEL */}
      {overlayVisible && (
        <PersonnelOverlay
          onSelect={handlePersonSelected}
          onClose={() => setOverlayVisible(false)}
        />
      )}

      {/* POPUP: ADD ITEM */}
      <AddItemPopup
        visible={addPopupVisible}
        onClose={closeAddPopup}
        onCreateItem={handleCreateItem}
        summaries={items.filter((i) => i.itemType === "summary")}
      />

      {/* HEADER */}
      <div className="preproject-header">Pre-Project Workspace</div>

      {/* TWO COLUMNS */}
      <div className="pp-dualpane-wrapper">
        <div className="pp-left-pane">
          <div className="pp-pane-header">Management</div>
          {renderPane(managementItems)}
        </div>

        <div className="pp-right-pane">
          <div className="pp-pane-header">Development</div>
          {renderPane(developmentItems)}
        </div>
      </div>

    </div>
  );
}
