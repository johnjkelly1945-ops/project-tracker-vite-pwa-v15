// @ts-nocheck
import { useEffect, useState } from "react";
import { REPO_SUMMARIES, REPO_TASKS } from "./domain/repository/RepositoryData";

import Sidebar from "./components/Sidebar";
import ModuleHeader from "./components/ModuleHeader";
import DualPane from "./components/DualPane";
import PreProject from "./components/PreProject";
import RepositoryView from "./components/RepositoryView";
import TaskPopup from "./components/TaskPopup";
import SummaryMoveModal from "./components/SummaryMoveModal";
import PersonnelPanel from "./components/PersonnelPanel";
import ProjectRegistersHost from "./components/registers/ProjectRegistersHost";
import { localAssignees } from "./data/localAssignees";
import { loadWorkspace } from "./storage/workspaceRepository";
import { saveWorkspace } from "./storage/workspaceRepository";

/*
=====================================================================
METRA — App.jsx
=====================================================================

Stage 277 — Project Registers Host (Baseline)
Stage 278A — Project Registers Host Surface (Read-Only)
Stage 299 — Authority Derivation Correction
Stage 301 — Workspace Structural Restoration
Stage 302 — Task & Summary Mutation Restoration (baseline-257C)
Stage 302-A — Reassignment Canon Clarification

Design Authority:
• Stage 298 — Authority Derivation & Pane Semantics (Design-Locked)
• SEM-NR-01-A — Authority Derivation & Pane Semantics
=====================================================================
*/

export default function App() {
  const [workspaceMode, setWorkspaceMode] = useState("dual");
  const [focusedPane, setFocusedPane] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // ------------------------------------------------------------------
  // AUTHORITY DERIVATION (LOCKED)
  // ------------------------------------------------------------------
  const hasMutationAuthority =
    workspaceMode === "single" && focusedPane !== null;

  const isReadOnly = !hasMutationAuthority;
  const isDev = focusedPane === "development";

  /* ===================== DATA ===================== */

  const [devSummaries, setDevSummaries] = useState([]);
  const [devTasks, setDevTasks] = useState([]);
  const [devSummaryOrder, setDevSummaryOrder] = useState([]);

  const [mgmtSummaries, setMgmtSummaries] = useState([]);
  const [mgmtTasks, setMgmtTasks] = useState([]);
  const [mgmtSummaryOrder, setMgmtSummaryOrder] = useState([]);

  const [activeTaskId, setActiveTaskId] = useState(null);
  const [activeSummaryId, setActiveSummaryId] = useState(null);

  // Stage 359A — Segment structural foundation (no UI use yet)
  const [segments, setSegments] = useState([]);
  /* ===================== REPOSITORY OVERLAY (UI ONLY) ===================== */
  const [repositoryOpen, setRepositoryOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Stage 359A — Load workspace with migration
  useEffect(() => {
    const saved = loadWorkspace();

    const defaultSegment = {
      segmentId: `segment-${Date.now()}`,
      segmentTitle: "Untitled Segment",
      archived: false,
      createdAt: Date.now(),
    };

    if (!saved) {
      setSegments([defaultSegment]);
      setWorkspaceMode("dual");
      setFocusedPane(null);
      setHydrated(true);
      return;
    }

    if (saved.schemaVersion === 1) {
      const upgradedDevTasks = (saved.dev?.tasks || []).map(t => ({
        ...t,
        segmentId: defaultSegment.segmentId,
      }));

      const upgradedMgmtTasks = (saved.mgmt?.tasks || []).map(t => ({
        ...t,
        segmentId: defaultSegment.segmentId,
      }));

      const upgradedDevSummaries = (saved.dev?.summaries || []).map(s => ({
        ...s,
        segmentId: defaultSegment.segmentId,
      }));

      const upgradedMgmtSummaries = (saved.mgmt?.summaries || []).map(s => ({
        ...s,
        segmentId: defaultSegment.segmentId,
      }));

      setSegments([defaultSegment]);

      setDevSummaries(upgradedDevSummaries);
      setDevTasks(upgradedDevTasks);
      setDevSummaryOrder(saved.dev?.order || []);

      setMgmtSummaries(upgradedMgmtSummaries);
      setMgmtTasks(upgradedMgmtTasks);
      setMgmtSummaryOrder(saved.mgmt?.order || []);

      setWorkspaceMode("dual");
      setFocusedPane(null);
      setHydrated(true);
      return;
    }

    if (saved.schemaVersion === 2) {
      setSegments(saved.segments || []);

      setDevSummaries(saved.dev?.summaries || []);
      setDevTasks(saved.dev?.tasks || []);
      setDevSummaryOrder(saved.dev?.order || []);

      setMgmtSummaries(saved.mgmt?.summaries || []);
      setMgmtTasks(saved.mgmt?.tasks || []);
      setMgmtSummaryOrder(saved.mgmt?.order || []);

      setWorkspaceMode("dual");
      setFocusedPane(null);
      setHydrated(true);
    }
  }, []);
  // Stage 357 — Save workspace on state change
  useEffect(() => {
    const workspaceData = {
      schemaVersion: 2,
      segments,
      dev: {
        summaries: devSummaries,
        tasks: devTasks,
        order: devSummaryOrder,
      },
      mgmt: {
        summaries: mgmtSummaries,
        tasks: mgmtTasks,
        order: mgmtSummaryOrder,
      },
    };

    if (!hydrated) return;
    saveWorkspace(workspaceData);
  }, [
    devSummaries,
    devTasks,
    devSummaryOrder,
    mgmtSummaries,
    mgmtTasks,
    mgmtSummaryOrder,
  ]);


  const [repositoryPane, setRepositoryPane] = useState("mgmt");

  useEffect(() => {
    function onIntent(e) {
      const intent = e?.detail;
      if (!intent || !intent.type) return;

      if (intent.type === "CLOSE_REPOSITORY_INTENT") {
        setRepositoryOpen(false);
        return;
      }

      if (intent.type === "INSTANTIATE_REPOSITORY_SELECTION_INTENT") {
        const p = intent.payload || {};
        const target = p.pane === "dev" ? "dev" : "mgmt";

        const setSummaries = target === "dev" ? setDevSummaries : setMgmtSummaries;
        const setSummaryOrder = target === "dev" ? setDevSummaryOrder : setMgmtSummaryOrder;
        const setTasks = target === "dev" ? setDevTasks : setMgmtTasks;

        const summaryIdMap = {};

        (p.summaryIds || []).forEach((repoSummaryId) => {
          const repoSummary = REPO_SUMMARIES.find(s => s.id === repoSummaryId);
          if (!repoSummary) return;

          const newId = `summary-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
          summaryIdMap[repoSummaryId] = newId;

          setSummaries(c => [...c, { id: newId, title: repoSummary.title }]);
          setSummaryOrder(c => [...c, newId]);
        });

        (p.taskIds || []).forEach((repoTaskId) => {
          const repoTask = REPO_TASKS.find(t => t.id === repoTaskId);
          if (!repoTask) return;

          const newTask = {
            id: `task-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
            title: repoTask.title,
            description: repoTask.description || "",
            notes: [],
            summaryId: summaryIdMap[repoTask.summaryId] || null,
            executionState: "NOT_STARTED",
            taskState: "active",
            segmentId: segments[0]?.segmentId,
          };

          setTasks(c => [...c, newTask]);
        });

        setRepositoryOpen(false);
        return;
      }
      if (intent.type === "INSTANTIATE_TASK_INTENT") {
        const p = intent.payload || {};
        const target = p.targetPane === "dev" ? "dev" : "mgmt";

        const newTask = {
          id: `task-${Date.now()}`,
          title: (p.title || "Untitled task").trim(),
          description: p.description || "",
          notes: [],
          summaryId: null,
          executionState: "NOT_STARTED",
          taskState: "active",
          segmentId: segments[0]?.segmentId,
        };

        (target === "dev" ? setDevTasks : setMgmtTasks)((c) => [...c, newTask]);
        setRepositoryOpen(false);
      }
    }

    window.addEventListener("METRA_INTENT", onIntent);
    return () => window.removeEventListener("METRA_INTENT", onIntent);
  }, []);

  /* ===================== NAV ===================== */

  function handleFocusPane(pane) {
    setWorkspaceMode("single");
    setFocusedPane(pane);
    setActiveTaskId(null);
    setActiveSummaryId(null);
  }

  function returnToDual() {
    setWorkspaceMode("dual");
    setFocusedPane(null);
    setActiveTaskId(null);
    setActiveSummaryId(null);
  }

  /* ===================== HELPERS ===================== */

  function deriveOrderedSummaries(summaries, order) {
    return order.length > 0
      ? order.map((id) => summaries.find((s) => s.id === id)).filter(Boolean)
      : summaries;
  }

  const orderedDevSummaries = deriveOrderedSummaries(
    devSummaries,
    devSummaryOrder
  );

  const orderedMgmtSummaries = deriveOrderedSummaries(
    mgmtSummaries,
    mgmtSummaryOrder
  );

  /* ===================== CREATION (INLINE — CANONICAL) ===================== */

  function onCreateTask() {
    if (isReadOnly) return;

    const title = window.prompt("Enter task title:");
    if (!title || !title.trim()) return;

    const task = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      notes: [],
      summaryId: null,
      executionState: "NOT_STARTED",
      taskState: "active",
      segmentId: segments[0]?.segmentId,
    };

    (isDev ? setDevTasks : setMgmtTasks)((c) => [...c, task]);
  }

  function onCreateSummary() {
    if (isReadOnly) return;

    const title = window.prompt("Enter summary name:");
    if (!title || !title.trim()) return;

    const id = `summary-${Date.now()}`;

    if (isDev) {
      setDevSummaries((c) => [...c, { id, title: title.trim() }]);
      setDevSummaryOrder((c) => [...c, id]);
    } else {
      setMgmtSummaries((c) => [...c, { id, title: title.trim() }]);
      setMgmtSummaryOrder((c) => [...c, id]);
    }
  }

  /* ===================== SUMMARY AUTHORITY ===================== */

  function openSummaryIfAuthorised(summaryId) {
    if (isReadOnly) return;
    setActiveSummaryId(summaryId);
  }

  function moveSummary(summaryId, direction) {
    if (isReadOnly) return;

    const setOrder = isDev ? setDevSummaryOrder : setMgmtSummaryOrder;

    setOrder((prev) => {
      const index = prev.indexOf(summaryId);
      if (index === -1) return prev;

      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;

      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next;
    });
  }

  function removeSummary(summaryId) {
    if (isReadOnly) return;

    if (isDev) {
      setDevSummaries((c) => c.filter((s) => s.id !== summaryId));
      setDevSummaryOrder((c) => c.filter((id) => id !== summaryId));
      setDevTasks((c) =>
        c.map((t) =>
          t.summaryId === summaryId ? { ...t, summaryId: null } : t
        )
      );
    } else {
      setMgmtSummaries((c) => c.filter((s) => s.id !== summaryId));
      setMgmtSummaryOrder((c) => c.filter((id) => id !== summaryId));
      setMgmtTasks((c) =>
        c.map((t) =>
          t.summaryId === summaryId ? { ...t, summaryId: null } : t
        )
      );
    }

    setActiveSummaryId(null);
  }

  /* ===================== TASK AUTHORITY ===================== */

  const tasks = isDev ? devTasks : mgmtTasks;

  function onOpenTask(task) {
    if (isReadOnly) return;
    setActiveTaskId(task.id);
  }

  // ------------------------------------------------------------------
  // ASSIGN / REASSIGN — CANONICAL (OVERWRITE ALLOWED)
  // ------------------------------------------------------------------
  function onAssignTask(taskId, assigneeId) {
    if (isReadOnly) return;

    const setTasks = isDev ? setDevTasks : setMgmtTasks;

    setTasks((c) =>
      c.map((t) =>
        t.id === taskId
          ? {
              ...t,
              assigneeId,
              assigneeLabel:
                localAssignees.find((a) => a.id === assigneeId)?.displayName ??
                assigneeId,
            }
          : t
      )
    );
  }

  function onChangeTaskSummary(taskId, summaryId) {
    if (isReadOnly) return;

    const setTasks = isDev ? setDevTasks : setMgmtTasks;

    setTasks((c) =>
      c.map((t) => (t.id === taskId ? { ...t, summaryId } : t))
    );
  }

  function onAddNote(taskId, note) {
    if (isReadOnly) return;

    const setTasks = isDev ? setDevTasks : setMgmtTasks;

    setTasks((c) =>
      c.map((t) =>
        t.id === taskId ? { ...t, notes: [...(t.notes || []), note] } : t
      )
    );
  }

  function onAddDescription(taskId, entry) {
    if (isReadOnly) return;

    const setTasks = isDev ? setDevTasks : setMgmtTasks;

    setTasks((c) =>
      c.map((t) =>
        t.id === taskId
          ? {
              ...t,
              descriptionEntries: [
                ...(t.descriptionEntries || []),
                entry,
              ],
            }
          : t
      )
    );
  }

  function onStartExecution(taskId) {
    if (isReadOnly) return;

    const setTasks = isDev ? setDevTasks : setMgmtTasks;

    setTasks((c) =>
      c.map((t) =>
        t.id === taskId && t.executionState === "NOT_STARTED"
          ? { ...t, executionState: "IN_PROGRESS" }
          : t
      )
    );
  }

  function onSubmitExecution(taskId) {
    if (isReadOnly) return;

    const setTasks = isDev ? setDevTasks : setMgmtTasks;

    setTasks((c) =>
      c.map((t) =>
        t.id === taskId && t.executionState === "IN_PROGRESS"
          ? { ...t, executionState: "SUBMITTED" }
          : t
      )
    );
  }

  function onCompleteExecution(taskId) {
    if (isReadOnly) return;

    const setTasks = isDev ? setDevTasks : setMgmtTasks;

    setTasks((c) =>
      c.map((t) =>
        t.id === taskId && t.executionState === "SUBMITTED"
          ? { ...t, executionState: "COMPLETED" }
          : t
      )
    );
  }

  function onArchiveTask(taskId) {
    const setTasks = isDev ? setDevTasks : setMgmtTasks;

    setTasks((c) =>
      c.map((t) =>
        t.id === taskId ? { ...t, taskState: "archived" } : t
      )
    );

    setActiveTaskId(null);
  }

  const activeTask =
    activeTaskId ? tasks.find((t) => t.id === activeTaskId) : null;

  /* ===================== SURFACES ===================== */

  const mgmtBody = (
    <PreProject
      summaries={orderedMgmtSummaries}
      tasks={mgmtTasks}
      onOpenTask={onOpenTask}
      onOpenSummary={openSummaryIfAuthorised}
      canCreateTask={hasMutationAuthority}
      onCreateTask={onCreateTask}
      canCreateSummary={hasMutationAuthority}
      onCreateSummary={onCreateSummary}
      canOpenRepository={hasMutationAuthority}
      onOpenRepository={() => {
        setRepositoryPane("mgmt");
        setRepositoryOpen(true);
      }}
    />
  );

  const devBody = (
    <PreProject
      summaries={orderedDevSummaries}
      tasks={devTasks}
      onOpenTask={onOpenTask}
      onOpenSummary={openSummaryIfAuthorised}
      canCreateTask={hasMutationAuthority}
      onCreateTask={onCreateTask}
      canCreateSummary={hasMutationAuthority}
      onCreateSummary={onCreateSummary}
      canOpenRepository={hasMutationAuthority}
      onOpenRepository={() => {
        setRepositoryPane("dev");
        setRepositoryOpen(true);
      }}
    />
  );

  /* ===================== RENDER ===================== */

  return (
    <>
      <ModuleHeader />

      <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
        <Sidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((v) => !v)}
        />

        <DualPane
          mode={workspaceMode}
          focusedPane={focusedPane}
          onFocusPane={handleFocusPane}
          onReturnToDual={returnToDual}
          managementBody={mgmtBody}
          developmentBody={devBody}
        />

        {false && <PersonnelPanel />}


        {repositoryOpen && (
          <RepositoryView pane={repositoryPane} />
        )}

        {activeSummaryId && (
          <SummaryMoveModal
            summaryId={activeSummaryId}
            summaries={isDev ? orderedDevSummaries : orderedMgmtSummaries}
            onMove={moveSummary}
            onRemove={removeSummary}
            onClose={() => setActiveSummaryId(null)}
          />
        )}

        {activeTask && (
          <TaskPopup
            task={activeTask}
            summaries={isDev ? orderedDevSummaries : orderedMgmtSummaries}
            onClose={() => setActiveTaskId(null)}
            onAddNote={onAddNote}
            onAddDescription={onAddDescription}
            onAssignTask={onAssignTask}
            onStartExecution={onStartExecution}
            onSubmitExecution={onSubmitExecution}
            onCompleteExecution={onCompleteExecution}
            onChangeTaskSummary={onChangeTaskSummary}
            onArchiveTask={onArchiveTask}
          />
        )}
      </div>
    </>
  );
}
