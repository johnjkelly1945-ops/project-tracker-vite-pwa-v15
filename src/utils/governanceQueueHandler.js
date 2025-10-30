// ======================================================================
// METRA – governanceQueueHandler.js
// Phase 3.6 – Governance Queue Activation & Cross-Link Validation
// ----------------------------------------------------------------------
// • Maintains silent background queue of governance events
// • Each record is linked by auditRef and governanceLink
// • Provides add / fetch / list utilities
// ======================================================================

const governanceQueue = []; // shared in-memory queue

export function addGovernanceRecord({
  type = "Change",
  title = "Untitled",
  description = "",
  auditRef = null,
  governanceLink = null,
  templateRef = null,
  projectId = "unassigned",
  timestamp = new Date().toISOString(),
}) {
  const entry = {
    id: `${type}-${Date.now().toString(36)}`,
    type,
    title,
    description,
    auditRef,
    governanceLink,
    templateRef,
    projectId,
    timestamp,
  };
  governanceQueue.push(entry);
  console.log(
    `[GOV] ${type} added | Ref:${auditRef || "none"} | Link:${governanceLink || "none"}`
  );
  return entry;
}

export function getGovernanceByLink(governanceLink) {
  return governanceQueue.filter((e) => e.governanceLink === governanceLink);
}

export function getGovernanceByAudit(auditRef) {
  return governanceQueue.filter((e) => e.auditRef === auditRef);
}

export function listGovernanceRecords() {
  return governanceQueue;
}
