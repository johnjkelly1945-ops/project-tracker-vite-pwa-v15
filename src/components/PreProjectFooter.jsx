// src/components/PreProjectFooter.jsx
import React from "react";
import "../Styles/PreProjectFooter.css";

/*
=====================================================================
METRA — PreProject Footer
Stage 12.6-A — Intent Emission (Footer)
---------------------------------------------------------------------
• Emits intent only
• No state mutation
• No creation logic
• No routing
• Dispatches explicit CustomEvent
=====================================================================
*/

export default function PreProjectFooter() {
  const emitIntent = (type) => {
    const payload = {
      type,
      source: "PreProjectFooter",
      timestamp: new Date().toISOString(),
    };

    // Trace (keep this)
    console.log("🧭 FOOTER INTENT", payload);

    // Dispatch intent to workspace
    window.dispatchEvent(
      new CustomEvent("metra-footer-intent", {
        detail: payload,
      })
    );
  };

  return (
    <div className="pp-footer-bar">
      <button onClick={() => emitIntent("ADD_SUMMARY_INTENT")}>
        Add Summary
      </button>

      <button onClick={() => emitIntent("ADD_TASK_INTENT")}>
        Add Task
      </button>

      <button onClick={() => emitIntent("OPEN_REPOSITORY_INTENT")}>
        View Repository
      </button>
    </div>
  );
}
