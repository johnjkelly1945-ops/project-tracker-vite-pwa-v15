/* ======================================================================
   METRA – governanceQueueHandler.js
   Phase 3.8 – Governance Queue Persistence & Audit Link Validation
   ----------------------------------------------------------------------
   • Manages background governance queue storage
   • Silent persistence via localStorage
   • Adds audit-linked records when triggered by popup saves
   • Provides export + clear functionality for Admin use
   • No visual UI output – logic-only module
   ====================================================================== */

// -------------------------
// LocalStorage configuration
// -------------------------
const STORAGE_KEY = "metra_governance_queue_v1";
const TIMESTAMP_KEY = "metra_governance_last_saved_v1";

// -------------------------
// Internal helper functions
// -------------------------

// Load queue from localStorage
function loadQueue() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.warn("[GOV] Failed to load queue:", err);
    return [];
  }
}

// Save queue to localStorage
function saveQueue(queue) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
  } catch (err) {
    console.warn("[GOV] Failed to save queue:", err);
  }
}

// -------------------------
// Public API
// -------------------------

// Add a new governance record
export function addGovernanceRecord(record) {
  if (!record || !record.auditRef) return;

  const queue = loadQueue();
  const newRecord = {
    auditRef: record.auditRef,
    type: record.type || "Change",
    title: record.title || "Untitled",
    governanceLink: record.governanceLink || null,
    timestamp: record.timestamp || Date.now(),
  };

  queue.push(newRecord);
  saveQueue(queue);

  console.log(
    `[GOV] Record added | Ref:${newRecord.auditRef} | Type:${newRecord.type}`
  );
}

// Retrieve all governance records
export function listGovernanceRecords() {
  return loadQueue();
}

// Export queue contents as JSON
export function exportGovernanceQueue() {
  const queue = loadQueue();
  const blob = new Blob([JSON.stringify(queue, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "metra_governance_queue.json";
  link.click();
  console.log(`[GOV] Exported ${queue.length} record(s)`);
}

// Clear all stored records
export function clearGovernanceQueue() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TIMESTAMP_KEY);
  console.log("[GOV] Governance queue cleared.");
}

// Get last saved timestamp
export function getLastSavedTimestamp() {
  const ts = localStorage.getItem(TIMESTAMP_KEY);
  return ts ? parseInt(ts, 10) : null;
}

// -------------------------
// End of module
// -------------------------
