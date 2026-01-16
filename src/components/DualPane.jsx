// src/components/DualPane.jsx
import React from "react";
import "../Styles/DualPane.css";

/*
=====================================================================
METRA — Stage 139 (Implementation Continuation)
DualPane with Minimal Pane Header Chrome
---------------------------------------------------------------------
• Stateless
• No behaviour
• No logic
• No authority
• Pane header is structural only
• Header hosts only explicitly provided content
=====================================================================
*/

export default function DualPane({
  leftHeader,
  leftBody,
  rightHeader,
  rightBody,
}) {
  return (
    <div className="dual-pane-root">
      <div className="dual-pane-left">
        <div className="pane-header">
          {leftHeader}
        </div>
        <div className="pane-body">
          {leftBody}
        </div>
      </div>

      <div className="dual-pane-right">
        <div className="pane-header">
          {rightHeader}
        </div>
        <div className="pane-body">
          {rightBody}
        </div>
      </div>
    </div>
  );
}
