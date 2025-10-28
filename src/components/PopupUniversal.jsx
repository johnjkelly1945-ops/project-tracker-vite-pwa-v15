/* ======================================================================
   METRA – PopupUniversal.jsx
   Phase: Universal Popup Framework v1 – Final Stable Persistence Sync
   ----------------------------------------------------------------------
   - Fixes race condition between restore and autosave
   - Ensures previous session text persists after reload
   - Includes full logging for verification
   ====================================================================== */

import React, { useState, useEffect, useRef } from "react";

export default function PopupUniversal({
  visible,
  onClose,
  taskTitle = "Demo Task",
  section = "Universal Test",
  storageKey = "metra_popup_universal",
  onSave,
}) {
  const [notes, setNotes] = useState("");
  const [emailRef, setEmailRef] = useState("");
  const [docLink, setDocLink] = useState("");
  const [ready, setReady] = useState(false);

  const globalKey = `METRA_${storageKey}`;

  // === Restore data once on mount ===
  useEffect(() => {
    const saved = window.localStorage.getItem(globalKey);
    console.log("🔍 Restoring data for key:", globalKey, saved);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotes(parsed.notes || "");
        setEmailRef(parsed.emailRef || "");
        setDocLink(parsed.docLink || "");
      } catch (e) {
        console.warn("⚠️ Could not parse saved data", e);
      }
    }
    // Delay autosave activation until after restore finishes
    setTimeout(() => setReady(true), 500);
  }, [globalKey]);

  // === Autosave only when ready ===
  useEffect(() => {
    if (!ready) return;
    const data = { notes, emailRef, docLink };
    window.localStorage.setItem(globalKey, JSON.stringify(data));
    console.log("💾 Autosaved (ready):", data);
  }, [notes, emailRef, docLink, globalKey, ready]);

  if (!visible) return null;

  // === Actions ===
  const handleAddTimestamp = () => {
    const now = new Date().toUTCString().replace("GMT", "UTC");
    setNotes((prev) => `${prev}\n${now}`);
  };

  const handleSave = () => {
    const data = { notes, emailRef, docLink };
    window.localStorage.setItem(globalKey, JSON.stringify(data));
    console.log("✅ Manual Save:", data);
    alert("✅ Entry saved and persisted.");
    if (onSave) onSave(data);
  };

  const handleReset = () => {
    setNotes("");
    setEmailRef("");
    setDocLink("");
    window.localStorage.removeItem(globalKey);
    console.log("🧹 Cleared:", globalKey);
  };

  // === Render ===
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.35)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "600px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#0a2b5c",
            color: "white",
            padding: "12px 16px",
            fontWeight: "600",
            fontSize: "1.1rem",
          }}
        >
          🖋 {section} — {taskTitle}
        </div>

        {/* Body */}
        <div style={{ padding: "16px" }}>
          <label style={{ fontWeight: "600", display: "block" }}>
            Notes / Comms
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter notes, actions, or updates here..."
            style={{
              width: "100%",
              height: "150px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              padding: "8px",
              fontSize: "0.95rem",
              resize: "vertical",
            }}
          />

          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button
              onClick={handleSave}
              style={{
                background: "#0a2b5c",
                color: "white",
                border: "none",
                padding: "6px 14px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              💾 Save
            </button>
            <button
              onClick={handleAddTimestamp}
              style={{
                background: "#2962ff",
                color: "white",
                border: "none",
                padding: "6px 14px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              ➕ Add Comment + Timestamp
            </button>
            <button
              onClick={handleReset}
              style={{
                background: "#aaa",
                color: "white",
                border: "none",
                padding: "6px 14px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              🔄 Reset
            </button>
          </div>

          {/* Email Reference */}
          <div style={{ marginTop: "14px" }}>
            <label style={{ fontWeight: "600", display: "block" }}>
              📧 Email Reference
            </label>
            <input
              type="text"
              value={emailRef}
              onChange={(e) => setEmailRef(e.target.value)}
              placeholder="e.g. Email sent 25 Oct re: action"
              style={{
                width: "100%",
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          {/* Document Link */}
          <div style={{ marginTop: "14px" }}>
            <label style={{ fontWeight: "600", display: "block" }}>
              📎 Document Link
            </label>
            <input
              type="text"
              value={docLink}
              onChange={(e) => setDocLink(e.target.value)}
              placeholder="https://"
              style={{
                width: "100%",
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px",
            textAlign: "right",
            borderTop: "1px solid #eee",
            background: "#fafafa",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "#c0392b",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            ✖ Close
          </button>
        </div>
      </div>
    </div>
  );
}
