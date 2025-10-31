/* ======================================================================
   METRA – resetMetraStorage.js
   Utility – LocalStorage Cleanup Helper
   ----------------------------------------------------------------------
   • Clears all PreProject task caches and audit logs
   • Safe: affects only METRA-related keys
   • Use before/after test rounds to remove rogue “[object Object]” data
   ====================================================================== */

export function resetMetraStorage() {
  try {
    const cleared = [];

    // --- Remove audit log ---
    localStorage.removeItem("metra_audit_log_v1");
    cleared.push("metra_audit_log_v1");

    // --- Remove PreProject task data ---
    Object.keys(localStorage)
      .filter((k) => k.startsWith("metra_preproject_task_"))
      .forEach((k) => {
        localStorage.removeItem(k);
        cleared.push(k);
      });

    console.log("🧹 METRA cleanup complete.");
    console.table(cleared.map((k) => ({ ClearedKey: k })));
    alert(`METRA localStorage cleaned.\n${cleared.length} entries removed.`);
  } catch (err) {
    console.error("Cleanup failed:", err);
    alert("METRA cleanup failed – check console for details.");
  }
}
