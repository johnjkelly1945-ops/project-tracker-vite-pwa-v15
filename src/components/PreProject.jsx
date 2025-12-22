/* ======================================================================
   METRA – PreProject.jsx
   Stage 12.2-B – Workspace Instantiation (PreProject-scoped persistence)
   ----------------------------------------------------------------------
   RESPONSIBILITIES:
   • Own PreProject workspace task list (scoped, temporary)
   • Persist tasks to localStorage (explicit key)
   • Listen for user-confirmed instantiation intent
   • Create tasks as INACTIVE
   • Attach to summary if present, else orphan
   • Close repository after successful add
   ----------------------------------------------------------------------
   NON-GOALS (EXPLICIT):
   • No summary creation
   • No task activation
   • No assignment logic
   • No routing
   • No global store
   ====================================================================== */

import React, { useEffect, useState } from "react";
import PreProjectDual from "./PreProjectDual";
import PreProjectFooter from "./PreProjectFooter";
import RepositoryView from "./RepositoryView";

/* ----------------------------------------------------------------------
   Stage 12.2-B storage key (EXPLICIT & SCOPED)
   ---------------------------------------------------------------------- */
const STORAGE_KEY = "metra-preproject-workspace-tasks";

/* ----------------------------------------------------------------------
   Helpers
   ---------------------------------------------------------------------- */
function loadWorkspaceTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWorkspaceTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function generateWorkspaceTaskId() {
  return `wk-task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ----------------------------------------------------------------------
   Component
   ---------------------------------------------------------------------- */
export default function PreProject() {
  const [isRepoOpen, setRepoOpen] = useState(false);
  const [workspaceTasks, setWorkspaceTasks] = useState([]);

  /* ------------------------------------------------------------------
     Load tasks on mount
     ------------------------------------------------------------------ */
  useEffect(() => {
    setWorkspaceTasks(loadWorkspaceTasks());
  }, []);

  /* ------------------------------------------------------------------
     Persist tasks on change
     ------------------------------------------------------------------ */
  useEffect(() => {
    saveWorkspaceTasks(workspaceTasks);
  }, [workspaceTasks]);

  /* ------------------------------------------------------------------
     Intent handler (authoritative)
     ------------------------------------------------------------------ */
  useEffect(() => {
    const handleIntent = (event) => {
      const { type, payload } = event.detail || {};

      /* ---- Open / Close repository ---- */
      if (type === "OPEN_REPOSITORY_INTENT") {
        setRepoOpen(true);
        return;
      }

      if (type === "CLOSE_REPOSITORY_INTENT") {
        setRepoOpen(false);
        return;
      }

      /* ---- Stage 12.2-B: Instantiate task (USER-CONFIRMED) ---- */
      if (type === "INSTANTIATE_TASK_INTENT" && payload) {
        const {
          repoTaskId,
          repoSummaryId = null,
          title,
          description = null,
          targetPane = "mgmt",
        } = payload;

        const newTask = {
          id: generateWorkspaceTaskId(),

          /* --- origin metadata (one-way, non-authoritative) --- */
          origin: {
            source: "repository",
            repoTaskId,
            repoSummaryId,
          },

          /* --- execution semantics --- */
          title,
          description,
          status: "inactive",
          assignedTo: null,

          /* --- structural placement --- */
          summaryId: repoSummaryId || null, // orphan-safe
          pane: targetPane,                  // mgmt / dev

          /* --- audit --- */
          createdAt: new Date().toISOString(),
          activatedAt: null,
        };

        setWorkspaceTasks((prev) => [...prev, newTask]);

        /* Close repository after successful add (LOCKED RULE) */
        setRepoOpen(false);
      }
    };

    window.addEventListener("METRA_INTENT", handleIntent);
    return () => window.removeEventListener("METRA_INTENT", handleIntent);
  }, []);

  /* ------------------------------------------------------------------
     Render
     ------------------------------------------------------------------ */
  return (
    <div className="preproject-container">
      {/* Workspace shell */}
      <PreProjectDual workspaceTasks={workspaceTasks} />

      <PreProjectFooter />

      {/* Repository modal (dominant, co-existing) */}
      {isRepoOpen && (
        <div className="repo-modal-overlay">
          <div className="repo-modal">
            <RepositoryView />
          </div>
        </div>
      )}
    </div>
  );
}
