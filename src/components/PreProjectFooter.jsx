// src/components/PreProjectFooter.jsx
import React from "react";
import "../Styles/PreProjectFooter.css";

/*
=====================================================================
METRA — Stage 11.5.3 (unchanged discipline)
PreProject Footer (INTENT ONLY)
---------------------------------------------------------------------
• Emits intent only
• No state mutation
• No creation logic
• No navigation
• Observable via window event
=====================================================================
*/

export default function PreProjectFooter() {
  const emitIntent = (type) => {
    const payload = {
      type,
      source: "PreProjectFooter",
      timestamp: new Date().toISOString(),
    };

    console.log("🧭 FOOTER INTENT", payload);

    // Stage 12.1-B:
    // Make intent observable without introducing authority or logic
    window.dispatchEvent(
      new CustomEvent("METRA_INTENT", { detail: payload })
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
