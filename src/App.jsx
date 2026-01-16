// @ts-nocheck
/*
=====================================================================
METRA — App.jsx
=====================================================================

STAGES
---------------------------------------------------------------------
Stage 138.1A — Dual-Pane Shell (No Data, No Execution)
Sidebar & Filters Operable (Inspection-Safe)
=====================================================================
*/

import React, { useState } from "react";

import Sidebar from "./components/Sidebar";
import DualPane from "./components/DualPane";
import ModuleHeader from "./components/ModuleHeader";

/*
---------------------------------------------------------------------
STAGE 138 — STEP 1A CONTRACT (AMENDED)
---------------------------------------------------------------------
• Dual-pane render only
• No data
• No execution UI
• No footer
• No workspace mutation
• Sidebar & filters operable (inspection-safe)
• Temporary pane markers ONLY
---------------------------------------------------------------------
*/

function PaneMarker({ label }) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#999",
        fontSize: "14px",
        letterSpacing: "0.08em",
        userSelect: "none",
      }}
    >
      {label}
    </div>
  );
}

export default function App() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <>
      <ModuleHeader />

      <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
        <Sidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded(v => !v)}
        />

        <div style={{ flex: 1 }}>
          <DualPane
            left={<PaneMarker label="LEFT PANE (inspection-only)" />}
            right={<PaneMarker label="RIGHT PANE (inspection-only)" />}
          />
        </div>
      </div>
    </>
  );
}
