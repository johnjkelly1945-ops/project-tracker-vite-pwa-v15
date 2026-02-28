// ======================================================================
// METRA — Repository Domain (Stage 356 Integration)
// Placeholder dataset (structural only)
// ======================================================================

export const REPO_BUNDLES = [
  {
    id: "repo-bundle-001",
    title: "Project Initiation (Generic)",
    discipline: "management",
    type: "Generic",
    scope: "Generic",
    level: "Project",
    method: "Generic",
  },
  {
    id: "repo-bundle-002",
    title: "Delivery Controls (Generic)",
    discipline: "management",
    type: "Generic",
    scope: "Generic",
    level: "Project",
    method: "Generic",
  },
];

export const REPO_SUMMARIES = [
  {
    id: "repo-summary-001",
    title: "Initiation Summary",
    discipline: "management",
    bundleId: "repo-bundle-001",
  },
  {
    id: "repo-summary-002",
    title: "Delivery Summary",
    discipline: "management",
    bundleId: "repo-bundle-002",
  },
];

export const REPO_TASKS = [
  {
    id: "repo-task-001",
    summaryId: "repo-summary-001",
    title: "Prepare project initiation notes",
    description: "Draft initial scope, assumptions, and constraints.",
    discipline: "management",
    type: "Generic",
    scope: "Generic",
    level: "Project",
    method: "Generic",
  },
  {
    id: "repo-task-002",
    summaryId: "repo-summary-001",
    title: "Identify key stakeholders",
    description: "List internal and external stakeholders.",
    discipline: "management",
    type: "Generic",
    scope: "Generic",
    level: "Project",
    method: "Generic",
  },
  {
    id: "repo-task-003",
    summaryId: "repo-summary-002",
    title: "Define success criteria",
    description: "Document measurable success factors.",
    discipline: "management",
    type: "Generic",
    scope: "Generic",
    level: "Project",
    method: "Generic",
  },
];
