import React, { useState } from "react";

/*
=====================================================================
METRA — PreProjectFooter.jsx
Stage 33 — Summary Creation Intent (FOOTER-ONLY)
=====================================================================

TypeScript-safe, footer-only intent acknowledgement.

No persistence.
No summary creation.
No ordering mutation.
No task or governance interaction.
=====================================================================
*/

/**
 * @typedef {Object} PreProjectFooterProps
 * @property {boolean} showCreateSummary
 */

export default function PreProjectFooter(
  /** @type {PreProjectFooterProps} */
  { showCreateSummary = false }
) {
  /** @type {[boolean, Function]} */
  const [showIntentAck, setShowIntentAck] = useState(false);

  const handleCreateSummaryClick = () => {
    setShowIntentAck(true);
    console.log(
      "Summary creation intent registered (Stage 33 — no persistence)"
    );
  };

  return (
    <footer className="preproject-footer">
      {showCreateSummary && (
        <button
          type="button"
          className="create-summary-button"
          onClick={handleCreateSummaryClick}
        >
          Create Summary
        </button>
      )}

      {showIntentAck && (
        <div
          style={{
            marginTop: "10px",
            padding: "8px 10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "#f8f9fa",
            fontSize: "0.85rem",
            maxWidth: "420px",
          }}
        >
          <strong>Summary creation intent registered.</strong>
          <div>No summary has been created.</div>

          <button
            type="button"
            style={{ marginTop: "6px", fontSize: "0.8rem" }}
            onClick={() => setShowIntentAck(false)}
          >
            Dismiss
          </button>
        </div>
      )}
    </footer>
  );
}
