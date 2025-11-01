/* ==========================================================
   METRA – AuditUtils.js  (Phase 4.4A.2)
   ----------------------------------------------------------
   Shared helper to queue audit entries using the same
   5-minute deferred-visibility model as AuditPanel.jsx.
   ========================================================== */

export const addAuditEntry = (actionText, keyRef = "generic") => {
  try {
    const stored = JSON.parse(localStorage.getItem("metra_audit_log")) || [];
    const now = Date.now();
    const visibleAfter = now + 5 * 60 * 1000;
    const role = JSON.parse(localStorage.getItem("metra_role")) || "User";

    // Remove any unreleased duplicate for same key + user
    const filtered = stored.filter(
      (e) => !(e.keyRef === keyRef && !e.released && e.user === role)
    );

    const newEntry = {
      id: filtered.length + 1,
      keyRef,
      user: role,
      action: actionText,
      timestampCreated: now,
      visibleAfter,
      released: false,
    };

    localStorage.setItem(
      "metra_audit_log",
      JSON.stringify([newEntry, ...filtered])
    );
  } catch (err) {
    console.error("Audit add failed:", err);
  }
};
