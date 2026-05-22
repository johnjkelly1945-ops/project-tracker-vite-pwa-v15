// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { setActingUser, getActingUser } from "./domain/actor/ActingUser";
import { REPO_SUMMARIES, REPO_TASKS } from "./domain/repository/RepositoryData";

import { hasContext } from "./domain/authority/hasContext";
import Sidebar from "./components/Sidebar";
import ArchiveHost from "./components/archive/ArchiveHost";
import ModuleHeader from "./components/ModuleHeader";
import DualPane from "./components/DualPane";
import PreProject from "./components/PreProject";
import RepositoryView from "./components/RepositoryView";
import TaskPopup from "./components/TaskPopup";
import SummaryMoveModal from "./components/SummaryMoveModal";
import PersonnelPanel from "./components/PersonnelPanel";
import ProjectRegistersHost from "./components/registers/ProjectRegistersHost";
import GovernanceModule from "./components/governance/GovernanceModule";
import { localAssignees } from "./data/localAssignees";
import { getPersonnel } from "./domain/personnel/PersonnelRegistry";
import { loadWorkspace } from "./storage/workspaceRepository";
import { saveWorkspace } from "./storage/workspaceRepository";
import RegisterItemView from "./components/RegisterItemView";
import DocumentModal from "./components/DocumentModal";
import GlobalEscalationLedgerModal from "./components/GlobalEscalationLedgerModal";
import GovernanceDashboard from "./components/GovernanceDashboard";
import { resolveObservationalWorld } from "./domain/observational/ObservationalWorldResolver";
import { getGovernanceEventsByTask } from "./governance/governanceStore";
import { getEscalationsByTask } from "./domain/escalation/EscalationStore";
import { resolveRelationshipsForSegment } from "./domain/relationships/RelationshipResolver";
import { createRelationship } from "./domain/relationships/RelationshipStore";

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

  const people = getPersonnel();

  const actingUser =
    people && people.length
      ? people[0]
      : {
          id: "john kelly",
          displayName: "john kelly",
          isPM: true,
        };

  useEffect(() => {

    const stored = localStorage.getItem("metra_acting_user");

    if (stored) {
      try {
        setActingUser(JSON.parse(stored));
      } catch (e) {
        console.warn("Invalid stored actor");
      }
    }

    const current = getActingUser();

    if (!current || !current.id) {
      setActingUser(actingUser);
    }

  }, []);
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

    /* ===================== STAGE 480 — OPERATIONAL VISIBILITY FILTERS ===================== */
    const [activeMgmtFilter, setActiveMgmtFilter] = useState("all");
    const [activeDevFilter, setActiveDevFilter] = useState("all");

  const [activeTaskId, setActiveTaskId] = useState(null);
  const [activeSummaryId, setActiveSummaryId] = useState(null);

  // Stage 359A — Segment structural foundation (no UI use yet)
  const [segments, setSegments] = useState([]);

  const [activeSegmentId, setActiveSegmentId] = useState(null);

  const activeSegmentIdRef = useRef(null);

  useEffect(() => {
    activeSegmentIdRef.current = activeSegmentId;
  }, [activeSegmentId]);
  /* ===================== REPOSITORY OVERLAY (UI ONLY) ===================== */
  const [repositoryOpen, setRepositoryOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [governanceDashboardOpen, setGovernanceDashboardOpen] = useState(false);
  const [globalEscalationLedgerOpen, setGlobalEscalationLedgerOpen] = useState(false);
  const [segmentContextOpen, setSegmentContextOpen] = useState(false);
  const [segmentTitleDraft, setSegmentTitleDraft] = useState("");
  const [segmentTypeDraft, setSegmentTypeDraft] = useState("PROJECT");
  const [coordinationTargetId, setCoordinationTargetId] = useState("");
  const [activeRegisterItem, setActiveRegisterItem] = useState(null);
  const [documentItem, setDocumentItem] = useState(null);
  const [documentOpen, setDocumentOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Stage 359A — Load workspace with migration
  useEffect(() => {
    const saved = loadWorkspace();

    const defaultSegment = {
      segmentId: `segment-${Date.now()}`,
      segmentTitle: "Untitled Segment",
      segmentType: "PROJECT",
      archived: false,
      createdAt: Date.now(),
    };

    if (!saved) {
      setSegments([defaultSegment]);
      setActiveSegmentId(defaultSegment.segmentId);
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
      setActiveSegmentId(defaultSegment.segmentId);
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
      if ((saved.segments || []).length > 0) {
        setActiveSegmentId((saved.segments || [])[0].segmentId);
      }
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
      if (intent.type === "OPEN_GLOBAL_ESCALATION_LEDGER") {
        setGlobalEscalationLedgerOpen(true);
        return;
      }

      if (intent.type === "OPEN_GOVERNANCE_DASHBOARD") {
        setGovernanceDashboardOpen(true);
        return;
      }
      if (intent.type === "OPEN_REGISTER_ITEM_VIEW") {
          console.log("INTENT RECEIVED FULL:", JSON.stringify(intent.payload, null, 2));
          const payload = intent.payload;

          if (payload && payload.category === "DOCUMENT") {
            setDocumentItem(payload);
            setDocumentOpen(true);
          } else {
            console.log("SETTING REGISTER ITEM:", payload);
            setActiveRegisterItem(payload);
          }
          return;
        }

      if (intent.type === "OPEN_ARCHIVE_INTENT") {
        setArchiveOpen(true);
        return;
      }

      if (intent.type === "CLOSE_ARCHIVE_INTENT") {
        setArchiveOpen(false);
        return;
      }

      if (intent.type === "CLOSE_REPOSITORY_INTENT") {
        setRepositoryOpen(false);
        return;
      }

      if (intent.type === "INSTANTIATE_REPOSITORY_SELECTION_INTENT") {
        const p = intent.payload || {};

      /* ===== SEGMENT SAFETY GUARD ===== */
      if (!activeSegmentIdRef.current) {
        console.warn("Repository instantiation blocked: no active segment");
        return;
      }
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

          setSummaries(c => [...c, { id: newId, title: repoSummary.title, segmentId: activeSegmentIdRef.current }]);
          setSummaryOrder(c => [...c, newId]);
        });

        (p.taskIds || []).forEach((repoTaskId) => {
          const repoTask = REPO_TASKS.find(t => t.id === repoTaskId);
          if (!repoTask) return;

          const newTask = {
            id: `task-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
            title: repoTask.title,
            systemAction: repoTask.systemAction || null,
            description: repoTask.description || "",
            notes: [],
            summaryId: summaryIdMap[repoTask.summaryId] || null,
            executionState: "NOT_STARTED",
            taskState: "active",
            segmentId: activeSegmentIdRef.current,
      assigneeId: null,
          };

          setTasks(c => [...c, newTask]);
        });

        setRepositoryOpen(false);
        return;
      }
      if (intent.type === "INSTANTIATE_TASK_INTENT") {
        const p = intent.payload || {};

      /* ===== SEGMENT SAFETY GUARD ===== */
      if (!activeSegmentIdRef.current) {
        console.warn("Repository instantiation blocked: no active segment");
        return;
      }
        const target = p.targetPane === "dev" ? "dev" : "mgmt";

        const newTask = {
          id: `task-${Date.now()}`,
          title: (p.title || "Untitled task").trim(),
          description: p.description || "",
          notes: [],
          summaryId: null,
          executionState: "NOT_STARTED",
          taskState: "active",
            segmentId: activeSegmentIdRef.current,
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
            segmentId: activeSegmentIdRef.current,
    };

    (isDev ? setDevTasks : setMgmtTasks)((c) => [...c, task]);
  }

  function onCreateSummary() {
    if (isReadOnly) return;

    const title = window.prompt("Enter summary name:");
    if (!title || !title.trim()) return;

    const id = `summary-${Date.now()}`;

    if (isDev) {
      setDevSummaries((c) => [...c, { id, title: title.trim(), segmentId: activeSegmentIdRef.current }]);
      setDevSummaryOrder((c) => [...c, id]);
    } else {
      setMgmtSummaries((c) => [...c, { id, title: title.trim(), segmentId: activeSegmentIdRef.current }]);
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


  /* ===================== STAGE 480 — OPERATIONAL VISIBILITY HELPERS ===================== */

  function isFlaggedTask(task) {
    if (!task) return false;

    const hasActiveGovernance =
      getGovernanceEventsByTask(task.id)
        .some((e) => e.status !== "CLOSED");

    const hasEscalation =
      getEscalationsByTask(task.id).length > 0;

    return hasActiveGovernance || hasEscalation;
  }

  function matchesOperationalFilter(task, filterId) {
    if (!task) return false;

    switch (filterId) {
      case "notstarted":
        return task.executionState === "NOT_STARTED";

      case "started":
        return task.executionState === "IN_PROGRESS";

      case "submitted":
        return task.executionState === "SUBMITTED";

      case "completed":
        return task.executionState === "COMPLETED";

      case "flagged":
        return isFlaggedTask(task);

      case "all":
      default:
        return true;
    }
  }
  /* ===================== SURFACES ===================== */


  const activeWorkspaceSegments = segments.filter(s => !s.archived);
  const effectiveSegmentId = activeSegmentId ?? activeWorkspaceSegments[0]?.segmentId ?? null;
  const activeSegment =
    activeWorkspaceSegments.find(s => s.segmentId === effectiveSegmentId) || null;

    const observationalWorld =
      resolveObservationalWorld(
        activeSegment,
        activeWorkspaceSegments
      );

    const segmentRelationships =
      activeSegment?.segmentId
        ? resolveRelationshipsForSegment(activeSegment.segmentId)
        : [];

  function handleAddCoordination() {
    if (!activeSegment?.segmentId) return;
    if (!coordinationTargetId) return;

    createRelationship({
      fromSegmentId: activeSegment.segmentId,
      toSegmentId: coordinationTargetId,
      relationshipType: "COORDINATES",
      createdBy: actor?.displayName || actor?.id || "system",
    });

    setCoordinationTargetId("");
  }


  useEffect(() => {
    setSegmentTitleDraft(activeSegment?.segmentTitle || "");
    setSegmentTypeDraft(activeSegment?.segmentType || "PROJECT");
  }, [activeSegment]);
  /* ===================== Stage 359C — Segment Render Filtering ===================== */
  const visibleDevSummaries = orderedDevSummaries.filter(s => (s.segmentId ?? activeWorkspaceSegments[0]?.segmentId) === effectiveSegmentId);
  const visibleDevTasks = devTasks.filter(t => (t.segmentId ?? activeWorkspaceSegments[0]?.segmentId) === effectiveSegmentId);

  const visibleMgmtSummaries = orderedMgmtSummaries.filter(s => (s.segmentId ?? activeWorkspaceSegments[0]?.segmentId) === effectiveSegmentId);
  const actor = getActingUser();

  const visibleMgmtTasks = (mgmtTasks || [])
    .filter(t => t && t.segmentId === effectiveSegmentId)
    .filter(t => {
      if (workspaceMode === "dual") return true;
      return actor && hasContext(actor, t);
    });

    const filteredMgmtTasks =
      visibleMgmtTasks.filter((t) =>
        matchesOperationalFilter(t, activeMgmtFilter)
      );

    const filteredDevTasks =
      visibleDevTasks.filter((t) =>
        matchesOperationalFilter(t, activeDevFilter)
      );
  const mgmtBody = (
    <PreProject
      summaries={visibleMgmtSummaries}
      tasks={filteredMgmtTasks}
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
      summaries={visibleDevSummaries}
      tasks={filteredDevTasks}
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


  function handleCreateSegment() {
    const base = "Untitled Segment";
    const count = segments.filter(s => s.segmentTitle.startsWith(base)).length;
    const title = count === 0 ? base : `${base} ${count + 1}`;
    const actor = getActingUser();

    const newSegment = {
      segmentId: `segment-${Date.now()}`,
      segmentTitle: title,
      segmentType: segmentTypeDraft,
      archived: false,
      createdAt: Date.now(),
      pmId: actor?.id
    };

    setSegments(prev => [...prev, newSegment]);
    setActiveSegmentId(newSegment.segmentId);
  }



  function handleSaveSegmentTitle() {
    if (activeSegment === null) return;

    setSegments(prev =>
      prev.map(s =>
        s.segmentId === activeSegment.segmentId
          ? {
              ...s,
              segmentTitle: segmentTitleDraft.trim() || "Untitled Segment",
              segmentType: segmentTypeDraft,
            }
          : s
      )
    );
  }
  /* ===================== Stage 360 — Segment Archive Handler ===================== */
  function handleArchiveSegment(segmentId) {
  setActiveSegmentId(null);
    setSegments(prev => {
      const updated = prev.map(s =>
        s.segmentId === segmentId
          ? { ...s, archived: true, archivedAt: s.archivedAt || Date.now() }
          : s
      );

      const remaining = updated.filter(s => !s.archived);

      if (remaining.length > 0) {
        setActiveSegmentId(remaining[0].segmentId);
      } else {
        setActiveSegmentId(null);
      }

      return updated;
    });
  }

  /* ===================== RENDER ===================== */

  return (
    <>

      {activeRegisterItem && (
        <RegisterItemView
          item={activeRegisterItem}
          onClose={() => setActiveRegisterItem(null)}
        />
      )}
        {documentOpen && (
          <DocumentModal
            document={documentItem}
            onClose={() => setDocumentOpen(false)}
          />
        )}

        {segmentContextOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999999,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "20px",
                width: "420px",
                borderRadius: "8px",
              }}
            >
              <strong>Segment Context</strong>

              <div style={{ marginTop: "16px" }}>
                  <div>
                    <strong>Segment Title:</strong>

                    <input
                      style={{
                        width: "100%",
                        marginTop: "6px",
                        padding: "6px",
                        boxSizing: "border-box",
                      }}
                      value={segmentTitleDraft}
                      onChange={(e) => setSegmentTitleDraft(e.target.value)}
                    />
                  </div>


                    <div style={{ marginTop: "12px" }}>
                      <strong>Segment Type:</strong>

                      <select
                        style={{
                          width: "100%",
                          marginTop: "6px",
                          padding: "6px",
                          boxSizing: "border-box",
                        }}
                        value={segmentTypeDraft}
                        onChange={(e) => setSegmentTypeDraft(e.target.value)}
                      >
                        <option value="PROJECT">Project</option>
                        <option value="PROGRAMME">Programme</option>
                      </select>
                    </div>

                  <div style={{ marginTop: "12px" }}>
                    <strong>Owner:</strong>{" "}
                    {activeSegment?.ownerName || "Not assigned"}
                  </div>

                  <div style={{ marginTop: "8px" }}>
                    <strong>PM:</strong>{" "}
                    {activeSegment?.pmName || activeSegment?.ownerName || "Not assigned"}
                  </div>

                <div style={{ marginTop: "8px" }}>
                  <strong>Created:</strong>{" "}
                  {activeSegment?.createdAt
                    ? new Date(activeSegment.createdAt).toLocaleString()
                    : "—"}
                </div>

                  <div style={{ marginTop: "16px" }}>
                    <strong>Relationships:</strong>

                    <div style={{ marginTop: "6px", fontSize: "13px" }}>
                      {segmentRelationships.length === 0 ? (
                        <div style={{ opacity: 0.6 }}>
                          No relationships
                        </div>
                      ) : (
                        segmentRelationships.map((r) => {
                          const relatedSegmentId =
                            r.fromSegmentId === activeSegment?.segmentId
                              ? r.toSegmentId
                              : r.fromSegmentId;

                            const relatedSegment = activeWorkspaceSegments.find((s) => s.segmentId === relatedSegmentId) || null;
                          return (
                            <div key={r.relationshipId}>
                              {r.relationshipType} → {relatedSegment?.segmentTitle || relatedSegmentId} ({relatedSegment?.segmentType || "SEGMENT"})
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                    <div style={{ marginTop: "12px" }}>
                      <strong>Add Coordination:</strong>

                        {segmentTypeDraft === "PROGRAMME" ? (
                          <>
                            <select
                              style={{
                                width: "100%",
                                marginTop: "6px",
                                padding: "6px",
                                boxSizing: "border-box",
                              }}
                              value={coordinationTargetId}
                              onChange={(e) => setCoordinationTargetId(e.target.value)}
                            >
                              <option value="">Select segment</option>

                              {activeWorkspaceSegments
                                .filter(
                                  (s) =>
                                    s.segmentId !== activeSegment?.segmentId &&
                                    (
                                      s.segmentType === "PROJECT" ||
                                      s.segmentType === "PROGRAMME"
                                    )
                                )
                                .map((s) => (
                                  <option key={s.segmentId} value={s.segmentId}>
                                    {s.segmentTitle} ({s.segmentType})
                                  </option>
                                ))}
                            </select>

                            <button
                              style={{ marginTop: "8px" }}
                              onClick={handleAddCoordination}
                            >
                              Add Coordination
                            </button>
                          </>
                        ) : (
                          <div
                            style={{
                              marginTop: "6px",
                              fontSize: "13px",
                              color: "#666",
                              lineHeight: 1.5,
                            }}
                          >
                            Projects participate observationally and may not author coordination topology.
                          </div>
                        )}
                    </div>

              </div>
              <div style={{ marginTop: "16px" }}>
                  <button onClick={handleSaveSegmentTitle}>
                    Save
                  </button>
                <button onClick={() => setSegmentContextOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        <ModuleHeader
          activeFilter={
            workspaceMode === "single"
              ? (
                  focusedPane === "management"
                    ? activeMgmtFilter
                    : activeDevFilter
                )
              : null
          }
          onChangeFilter={(filterId) => {
            if (workspaceMode !== "single") return;

            if (focusedPane === "management") {
              setActiveMgmtFilter(filterId);
            } else {
              setActiveDevFilter(filterId);
            }
          }}
        />

      <div style={{ padding: "8px 16px", borderBottom: "1px solid #eee" }}>
        <label style={{ marginRight: 8 }}>Segment:</label>
        <select
          value={activeSegmentId ?? ""}
          onChange={(e) => setActiveSegmentId(e.target.value)}
        >
          {segments
            .filter(s => !s.archived)
            .map(s => (
              <option key={s.segmentId} value={s.segmentId}>
                {s.segmentTitle}
              </option>
            ))}
        </select>
          {workspaceMode === "single" && (
            <>
              <button
                style={{ marginLeft: 8 }}
                onClick={() => setSegmentContextOpen(true)}
              >
                Context
              </button>

              <button
                style={{ marginLeft: 8 }}
                onClick={handleCreateSegment}
                disabled={!hasMutationAuthority}
              >
                + New
              </button>
            </>
          )}
      </div>


      <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
        <Sidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((v) => !v)}
            effectiveSegmentId={effectiveSegmentId}
        />

        <DualPane
          mode={workspaceMode}
          focusedPane={focusedPane}
          onFocusPane={handleFocusPane}
          onReturnToDual={returnToDual}
            activeFilter={
              focusedPane === "management"
                ? activeMgmtFilter
                : activeDevFilter
            }
            onChangeFilter={(filterId) => {
              if (focusedPane === "management") {
                setActiveMgmtFilter(filterId);
              } else {
                setActiveDevFilter(filterId);
              }
            }}
          managementBody={mgmtBody}
          developmentBody={devBody}
        />

        {false && <PersonnelPanel />}
        {false && <GovernanceModule />}


        {repositoryOpen && (
          <RepositoryView pane={repositoryPane} />
        )}

        {archiveOpen && (
          <ArchiveHost
            segments={segments}
            summaries={[...devSummaries, ...mgmtSummaries]}
            tasks={[...devTasks, ...mgmtTasks]}
            onClose={() => setArchiveOpen(false)}
          />
        )}

        {activeSummaryId && (
          <SummaryMoveModal
            summaryId={activeSummaryId}
            summaries={isDev ? visibleDevSummaries : visibleMgmtSummaries}
            onMove={moveSummary}
            onRemove={removeSummary}
            onClose={() => setActiveSummaryId(null)}
          />
        )}

        {activeTask && (
          <TaskPopup
            hasMutationAuthority={hasMutationAuthority}
            workspaceMode={workspaceMode}
            onArchiveSegment={handleArchiveSegment}
            task={activeTask}
            actingUser={actingUser}
            summaries={isDev ? visibleDevSummaries : visibleMgmtSummaries}
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

      {globalEscalationLedgerOpen && (
        <GlobalEscalationLedgerModal
          tasks={[...devTasks, ...mgmtTasks]}
            activeSegmentId={activeSegmentId}
          onClose={() => setGlobalEscalationLedgerOpen(false)}
        />
      )}

        {governanceDashboardOpen && (
          <GovernanceDashboard
            activeSegment={activeSegment}
            observationalWorld={observationalWorld}
            onClose={() => setGovernanceDashboardOpen(false)}
          />
        )}


      {activeRegisterItem && (
        <RegisterItemView
          item={activeRegisterItem}
          onClose={() => setActiveRegisterItem(null)}
        />
      )}

    </>
  );
}
