/* ======================================================================
   METRA – App.jsx
   Stage 3.2 – DualPane Active Mode (Isolated Layout Testing)
   ----------------------------------------------------------------------
   TEMPORARY ADDITION:
   ✔ Stage 10.3/10.4 – Document Pipeline + Persistence (DEV harness)
   ✔ Explicit user action only
   ✔ localStorage persistence
   ✔ Clearly removable
   ====================================================================== */

import React, { useState, useEffect } from "react";

/* === EXISTING IMPORTS (UNCHANGED) === */
import DualPane from "./components/DualPane";
import FilterBar from "./components/FilterBar";

/* === STAGE 10 IMPORTS === */
import TemplatePickerOverlay from "./components/TemplatePickerOverlay";
import { createDocumentFromTemplate } from "./documents/documentFactory";
import { loadDocuments, saveDocuments } from "./documents/documentStore";

/* === STYLES (UNCHANGED) === */
import "./Styles/App.v2.css";
import "./Styles/DualPane.css";
import "./Styles/FilterBar.css";

export default function App() {

  /* ==============================================================
     STAGE 10.4 – DOCUMENT STATE (PERSISTED)
     ============================================================== */
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const restored = loadDocuments();
    setDocuments(restored);
  }, []);

  useEffect(() => {
    saveDocuments(documents);
  }, [documents]);

  /* ==============================================================
     STAGE 10.3/10.4 – DEV TEST HARNESS
     ============================================================== */
  const [showTemplateTest, setShowTemplateTest] = useState(false);

  const handleTemplateTestSelect = (template) => {
    const doc = createDocumentFromTemplate(template, {
      linkedTo: "TEST",
      linkedType: "test",
      createdBy: "user"
    });

    setDocuments((prev) => [...prev, doc]);
    setShowTemplateTest(false);

    console.log("📄 METRA document created & persisted:", doc);
  };

  return (
    <div className="app-container">

      {/* === GLOBAL HEADER (UNCHANGED) === */}
      <header className="global-header">
        METRA – PreProject
      </header>

      {/* === FILTER BAR (UNCHANGED) === */}
      <FilterBar />

      {/* ==========================================================
          STAGE 10.4 – FIXED DEV PANEL (VISIBILITY GUARANTEED)
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

        <div style={{ marginTop: "6px", fontSize: "0.85em" }}>
          Stored documents: <strong>{documents.length}</strong>
        </div>
      </div>

      {/* === DUAL PANE (UNCHANGED) === */}
      <DualPane />

      {/* === TEMPLATE PICKER OVERLAY === */}
      {showTemplateTest && (
        <TemplatePickerOverlay
          onSelect={handleTemplateTestSelect}
          onClose={() => setShowTemplateTest(false)}
        />
      )}
    </div>
  );
}
