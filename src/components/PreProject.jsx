/* ======================================================================
   METRA – PreProject.jsx
   Workspace Root
   ----------------------------------------------------------------------
   • Owns workspace state
   • Renders ModuleHeader, Workspace, Footer
   • Handles footer intent and popups
   • No execution leakage
   ====================================================================== */

import React, { useEffect, useState } from "react";
import ModuleHeader from "./ModuleHeader";
import PreProjectFooter from "./PreProjectFooter";
import AddItemPopup from "./AddItemPopup";
import PreProjectDual from "./PreProjectDual";

const TASK_STORAGE_KEY = "metra-workspace-tasks";
const SUMMARY_STORAGE_KEY = "metra-workspace-summaries";

export default function PreProject() {
  /* ===================== STATE ===================== */

  const [tasks, setTasks] = useState([]);
  const [summaries, setSummaries] = useState([]);

  const [popupState, setPopupState] = useState(null);
  // popupState = { type: "task" | "summary" } | null

  /* ===================== LOAD / SAVE ===================== */

  useEffect(() => {
    const savedTasks = localStorage.getItem(TASK_STORAGE_KEY);
    const savedSummaries = localStorage.getItem(SUMMARY_STORAGE_KEY);

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedSummaries) setSummaries(JSON.parse(savedSummaries));
  }, []);

  useEffect(() => {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(SUMMARY_STORAGE_KEY, JSON.stringify(summaries));
  }, [summaries]);

  /* ===================== FOOTER INTENT LISTENER ===================== */

  useEffect(() => {
    const handleFooterIntent = (event) => {
      const payload = event.detail;
      if (!payload || !payload.type) return;

      if (payload.type === "ADD_TASK_INTENT") {
        setPopupState({ type: "task" });
      }

      if (payload.type === "ADD_SUMMARY_INTENT") {
        setPopupState({ type: "summary" });
      }
    };

    window.addEventListener("metra-footer-intent", handleFooterIntent);
    return () =>
      window.removeEventListener("metra-footer-intent", handleFooterIntent);
  }, []);

  /* ===================== POPUP CONFIRM ===================== */

  const handlePopupConfirm = (data) => {
    if (popupState?.type === "task") {
      const newTask = {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description || "",
        status: "inactive",
        summaryId: data.summaryId || null,
        targetPane: "mgmt",
      };

      setTasks((prev) => [...prev, newTask]);
    }

    if (popupState?.type === "summary") {
      const newSummary = {
        id: crypto.randomUUID(),
        title: data.title,
        targetPane: "mgmt",
      };

      setSummaries((prev) => [...prev, newSummary]);
    }

    setPopupState(null);
  };

  /* ===================== RENDER ===================== */

  return (
    <div className="preproject-wrapper">

      {/* Workspace Header */}
      <ModuleHeader />

      {/* Workspace Body */}
      <PreProjectDual
        workspaceTasks={tasks}
        workspaceSummaries={summaries}
      />

      {/* Workspace Footer */}
      <PreProjectFooter />

      {/* Popup */}
      {popupState && (
        <AddItemPopup
          type={popupState.type}
          workspaceSummaries={summaries}
          onCancel={() => setPopupState(null)}
          onConfirm={handlePopupConfirm}
        />
      )}

    </div>
  );
}
