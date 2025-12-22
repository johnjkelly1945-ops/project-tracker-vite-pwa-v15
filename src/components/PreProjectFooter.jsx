// src/components/PreProjectFooter.jsx
import React from "react";
import "../Styles/PreProjectFooter.css";

/*
=====================================================================
METRA — Stage 12.2-C
PreProject Footer (INTENT EMITTER – DISPATCH ENABLED)
---------------------------------------------------------------------
• Emits user intent ONLY
• No state mutation
• No creation logic
• No navigation
• Dispatches METRA_INTENT events
=====================================================================
*/

export default function PreProjectFooter() {
  const emitIntent = (type) => {
    const intent = {
      type,
      source: "PreProjectFooter",
      timestamp: new Date().toISOString(),
    };

    console.log("🧭 FOOTER INTENT", intent);

    window.dispatchEvent(
      new CustomEvent("METRA_INTENT", {
        detail: intent,
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
