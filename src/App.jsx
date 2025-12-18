/* ======================================================================
   METRA – App.jsx
   Stage 3.2 – DualPane Active Mode (Isolated Layout Testing)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Keep global header stable
   ✔ Keep filter bar visible
   ✔ Render DualPane.jsx for isolated scroll & layout debugging
   ✔ DO NOT affect PreProjectDual.jsx until DualPane is verified
   ----------------------------------------------------------------------
   TEMPORARY ADDITION:
   ✔ Stage 10.3.1A – Document Pipeline Test Harness
   ✔ Explicit user action only
   ✔ No persistence
   ✔ Clearly removable
   ====================================================================== */

import React, { useState } from "react";

/* === EXISTING IMPORTS (UNCHANGED) === */
import DualPane from "./components/DualPane";
import FilterBar from "./components/FilterBar";

/* === STAGE 10 DOCUMENT PIPELINE IMPORTS === */
import TemplatePickerOverlay from "./components/TemplatePickerOverlay";
import { createDocumentFromTemplate } from "./documents/documentFactory";

/* === STYLES (UNCHANGED) === */
import "./Styles/App.v2.css";
import "./Styles/DualPane.css";
import "./Styles/FilterBar.css";

export default function App() {

  /* ==============================================================
     STAGE 10.3.1A – DOCUMENT PIPELINE TEST HARNESS (TEMPORARY)
     ============================================================== */

  const [showTemplateTest, setShowTemplateTest] = useState(false);
  const [testDocument, setTestDocument] = useState(null);

  const handleTemplateTestSelect = (template) => {
    const doc = createDocumentFromTemplate(template, {
      linkedTo: "TEST",
      linkedType: "test",
      createdBy: "user"
    });

    setTestDocument(doc);
    setShowTemplateTest(false);

    console.log("📄 METRA document created (pipeline test harness):", doc);
  };

  return (
    <div className="app-container">

      {/* ==========================================================
          GLOBAL MAIN HEADER (UNCHANGED)
         ========================================================== */}
      <header className="global-header">
        METRA – PreProject
      </header>

      {/* ==========================================================
          FILTER BAR (UNCHANGED)
         ========================================================== */}
      <FilterBar />

      {/* ==========================================================
          STAGE 10.3.1A – FIXED VISIBILITY TEST PANEL
          ----------------------------------------------------------
          • Fixed position
          • High z-index
          • Dev-only
          ========================================================== */}
      <div
        style={{
          position: "fixed",
          top: "110px",
          right: "12px",
          zIndex: 9999,
          background: "#ffffff",
          border: "1px solid #ccc",
          padding: "8px",
          borderRadius: "6px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
        }}
      >
        <button
          style={{ padding: "6px 12px", fontSize: "0.9em" }}
          onClick={() => setShowTemplateTest(true)}
        >
          [DEV] Test Document Pipeline
        </button>

        {testDocument && (
          <div style={{ marginTop: "6px", fontSize: "0.85em" }}>
            Document created:
            <br />
            <strong>{testDocument.title}</strong>
          </div>
        )}
      </div>

      {/* ==========================================================
          DUAL PANE SCAFFOLD (UNCHANGED)
         ========================================================== */}
      <DualPane />

      {/* ==========================================================
          TEMPLATE PICKER OVERLAY (TEST HARNESS)
         ========================================================== */}
      {showTemplateTest && (
        <TemplatePickerOverlay
          onSelect={handleTemplateTestSelect}
          onClose={() => setShowTemplateTest(false)}
        />
      )}

    </div>
  );
}
