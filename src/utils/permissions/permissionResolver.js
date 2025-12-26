// ================================================================
// METRA — Stage 17
// Permission Resolver (Step 1 — Non-enforcing)
// ================================================================
//
// PURPOSE:
// Centralised, deterministic permission resolution.
// This file MUST NOT:
// - mutate state
// - affect UI behaviour
// - block actions
// - call persistence
//
// Enforcement is added in later steps.
//
// ================================================================

export function resolvePermissions(context) {
  const {
    workspaceMode,   // 'management' | 'delivery'
    moduleContext,   // 'preproject' | 'governance' | etc.
    taskOrigin,      // 'repository' | 'workspace'
    taskState,       // 'active' | 'completed' | 'archived'
    role             // mocked string, e.g. 'editor'
  } = context;

  // --------------------------------------------------------------
  // DEFAULTS — conservative by design
  // --------------------------------------------------------------
  const permissions = {
    canView: true,
    canEdit: false,
    canCreate: false,
    canDeleteOrArchive: false,
    reason: "default read-only"
  };

  // --------------------------------------------------------------
  // HARD READ-ONLY CONDITIONS (definition only)
  // --------------------------------------------------------------
  if (taskOrigin === "repository") {
    permissions.reason = "repository-derived task";
    return permissions;
  }

  if (taskState === "completed") {
    permissions.reason = "completed task";
    return permissions;
  }

  if (taskState === "archived") {
    permissions.reason = "archived task";
    return permissions;
  }

  // --------------------------------------------------------------
  // CONTEXTUAL ALLOWANCE (still non-enforcing)
  // --------------------------------------------------------------
  if (
    taskOrigin === "workspace" &&
    taskState === "active" &&
    workspaceMode === "delivery"
  ) {
    permissions.canEdit = true;
    permissions.canCreate = true;
    permissions.canDeleteOrArchive = true;
    permissions.reason = "workspace active task (delivery mode)";
  }

  return permissions;
}
