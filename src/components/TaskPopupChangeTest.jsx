/* === METRA Phase 9.9A.9-Step3 – Structured Input Actions
   ------------------------------------------------------------------------
   Builds on Step2 baseline (audit trail panel verified).
   Adds three input actions above Audit Trail Log:
     📝 Add Note, 📧 Add Email, 📄 Add Document
   Each opens an inline input field; Enter / ⌘+Enter saves entry.
   ======================================================================== */

import React, { useState, useEffect, useRef } from "react";

export default function TaskPopupChangeTest() {
  const STORAGE_KEY = "metra_change_steps_v9_9A8";
  const AUDIT_KEY = "metra_audit_v9_9A9";
  const logRef = useRef(null);

  // === Timestamp ===
  const metraTimestamp = () => {
    const d = new Date();
    const day = d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const time = d.toLocaleTimeString("en-GB", { hour12: false });
    return `${day} ${time} UTC`;
  };

  const defaultSteps = [
    { id: 1, title: "Impact Assessment", status: "Not Started", notes: "", email: "", link: "", open: false },
    { id: 2, title: "Board Review", status: "Not Started", notes: "", email: "", link: "", open: false },
    { id: 3, title: "Implementation Verification", status: "Not Started", notes: "", email: "", link: "", open: false },
  ];

  const [steps, setSteps] = useState(defaultSteps);
  const [auditEntries, setAuditEntries] = useState([]);

  // === Structured input state ===
  const [activeInput, setActiveInput] = useState(null); // "note" | "email" | "document"
  const [inputValue, setInputValue] = useState("");

  // === Load saved steps ===
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setSteps(JSON.parse(stored)); }
      catch { localStorage.removeItem(STORAGE_KEY); }
    }
  }, []);

  // === Save steps ===
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(steps)); }, [steps]);

  // === Load audit trail ===
  useEffect(() => {
    const storedAudit = localStorage.getItem(AUDIT_KEY);
    if (storedAudit) {
      try {
        const parsed = JSON.parse(storedAudit);
        setAuditEntries(parsed);
        console.log("✅ Audit trail loaded:", parsed);
      } catch (err) { console.error("Error parsing stored audit data", err); }
    } else {
      console.log("ℹ️ No existing audit data found.");
    }
  }, []);

  // === Save + Auto-scroll ===
  useEffect(() => {
    if (auditEntries.length > 0) {
      localStorage.setItem(AUDIT_KEY, JSON.stringify(auditEntries));
      console.log("💾 Audit trail updated:", auditEntries);
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [auditEntries]);

  // === Add entry (used by all three input types) ===
  const addAuditEntry = (type, text) => {
    if (!text.trim()) return;
    const icons = { note: "📝", email: "📧", document: "📄" };
    const newEntry = {
      id: Date.now(),
      type,
      icon: icons[type],
      content: text.trim(),
      timestamp: metraTimestamp(),
      user: "John Kelly",
    };
    setAuditEntries((prev) => [...prev, newEntry]);
    setInputValue("");
    setActiveInput(null);
  };

  // === Existing popup functions ===
  const toggleOpen = (id) =>
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, open: !s.open } : s)));

  const handleSave = (id, field, ref) => {
    const stamp = metraTimestamp();
    setSteps((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, [field]: `${s[field].trim()}\n${stamp}`.trim() } : s
      )
    );
    if (ref?.current) ref.current.scrollTop = ref.current.scrollHeight;
  };

  const handleQuickComment = (id, ref) => {
    const stamp = metraTimestamp();
    const comment = window.prompt("Enter quick comment:");
    if (comment) {
      setSteps((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, notes: `${s.notes}\n${comment}\n${stamp}`.trim() } : s
        )
      );
      if (ref?.current) ref.current.scrollTop = ref.current.scrollHeight;
    }
  };

  const handleStatus = (id, status) => {
    const stamp = metraTimestamp();
    setSteps((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status, notes: `${s.notes}\n${stamp}`.trim() } : s
      )
    );
  };

  const addStep = () => {
    const now = metraTimestamp();
    const newStep = { id: Date.now(), title: "New Step", status: "Not Started", notes: now, email: "", link: "", open: true };
    setSteps((prev) => [...prev, newStep]);
  };

  const resetToDefault = () => {
    if (window.confirm("Reset to default steps?")) {
      localStorage.removeItem(STORAGE_KEY);
      setSteps(defaultSteps);
    }
  };

  // === Input handler ===
  const handleKeyDown = (e) => {
    if ((e.key === "Enter" && !e.shiftKey) || ((e.metaKey || e.ctrlKey) && e.key === "Enter")) {
      e.preventDefault();
      addAuditEntry(activeInput, inputValue);
    }
  };

  return (
    <div className="popup-container">
      <div className="popup-header">Change</div>
      <div className="popup-subheader"><strong>Change Matter:</strong> Cable Routing Review</div>

      <div className="popup-content">
        {/* === Steps List === */}
        {steps.map((s) => {
          const noteRef = useRef(null);
          return (
            <div key={s.id} className="step-card">
              <div className="step-row" onClick={() => toggleOpen(s.id)}>
                <span className="caret">{s.open ? "▾" : "▸"}</span>
                <input
                  className="title-edit"
                  value={s.title}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    setSteps((p) => p.map((x) => (x.id === s.id ? { ...x, title: e.target.value } : x)))
                  }
                />
                <span className="status-label">{s.status}</span>
              </div>

              <div
                className="expandable"
                style={{ maxHeight: s.open ? "700px" : "0", transition: "max-height 0.35s ease", overflow: "hidden" }}
              >
                <div className="expand-inner">
                  <div className="collapse-line"><span className="collapse-cue" onClick={() => toggleOpen(s.id)}>▲</span></div>
                  <div className="status-buttons">
                    <button onClick={() => handleStatus(s.id, "Started")}>Start</button>
                    <button onClick={() => handleStatus(s.id, "Completed")}>Complete</button>
                    <button onClick={() => handleStatus(s.id, "Not Started")}>Reset</button>
                  </div>

                  {["notes", "email", "link"].map((f) => (
                    <div key={f} className="field-block">
                      <label>
                        {f === "notes" ? "Notes / Comms" : f === "email" ? "📧 Email Ref" : "🔗 Document Link"}
                      </label>
                      {f === "notes" ? (
                        <div className="notes-wrapper">
                          <textarea
                            ref={noteRef}
                            rows="5"
                            value={s[f]}
                            onChange={(e) =>
                              setSteps((p) => p.map((x) => (x.id === s.id ? { ...x, [f]: e.target.value } : x)))
                            }
                            onKeyDown={(e) => {
                              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSave(s.id, f, noteRef);
                            }}
                            className="notes-area"
                          />
                          <div className="notes-buttons">
                            <button className="save-btn" onClick={() => handleSave(s.id, f, noteRef)}>💾 Save</button>
                            <button className="quick-btn" onClick={() => handleQuickComment(s.id, noteRef)}>➕ Add Comment + Timestamp</button>
                          </div>
                        </div>
                      ) : (
                        <input
                          type={f === "link" ? "url" : "text"}
                          value={s[f]}
                          placeholder={f === "email" ? "e.g. Email sent 25 Oct re: approval" : "https://"}
                          onChange={(e) =>
                            setSteps((p) => p.map((x) => (x.id === s.id ? { ...x, [f]: e.target.value } : x)))
                          }
                          onKeyDown={(e) => {
                            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSave(s.id, f);
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* === Structured Input Actions === */}
        <div className="audit-actions">
          <button onClick={() => setActiveInput("note")}>📝 Add Note</button>
          <button onClick={() => setActiveInput("email")}>📧 Add Email</button>
          <button onClick={() => setActiveInput("document")}>📄 Add Document</button>
        </div>

        {/* === Inline Input Row === */}
        {activeInput && (
          <div className="input-row">
            <input
              type="text"
              placeholder={
                activeInput === "note"
                  ? "Enter note..."
                  : activeInput === "email"
                  ? "Enter email reference..."
                  : "Enter document name or link..."
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <button className="cancel-btn" onClick={() => { setInputValue(""); setActiveInput(null); }}>✖</button>
          </div>
        )}

        {/* === Audit Trail Panel === */}
        <div className="audit-panel">
          <h4>Audit Trail Log</h4>
          <div className="audit-log" ref={logRef}>
            {auditEntries.length === 0 ? (
              <div className="audit-empty">No audit entries recorded yet.</div>
            ) : (
              auditEntries.map((entry) => (
                <div key={entry.id} className="audit-line">
                  <span className="audit-icon">{entry.icon}</span>
                  <span className="audit-text">{entry.content}</span>
                  <span className="audit-time">{entry.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* === Step controls === */}
        <div className="action-row">
          <button onClick={addStep}>➕ Add Step</button>
          <button onClick={resetToDefault}>🔄 Reset to Default</button>
        </div>
      </div>

      <style>{`
        .popup-container{background:#fff;border-radius:8px;width:90%;max-width:720px;margin:auto;
          box-shadow:0 0 8px rgba(0,0,0,0.1);overflow-y:auto;max-height:80vh;}
        .popup-header{background:#0a2b5c;color:#fff;font-weight:bold;padding:0.5rem 1rem;border-radius:6px 6px 0 0;text-align:center;}
        .popup-subheader{background:#eef1f6;padding:0.5rem 1rem;border-bottom:1px solid #ddd;font-size:0.95rem;}
        .popup-content{padding:1rem;}
        .step-card{border:1px solid #ddd;border-radius:6px;margin-bottom:0.7rem;background:#f9fafc;}
        .step-row{display:flex;align-items:center;cursor:pointer;padding:0.5rem;background:#eef3fb;border-radius:6px;font-weight:600;}
        .caret{width:20px;text-align:center;}
        .title-edit{flex:1;border:none;background:transparent;border-bottom:1px solid #ccc;outline:none;font-size:0.95rem;font-weight:600;}
        .status-label{font-size:0.85rem;color:#333;margin-left:0.4rem;}
        .collapse-line{display:flex;justify-content:flex-end;}
        .collapse-cue{cursor:pointer;color:#0a2b5c;}
        .expand-inner{padding:0.6rem 0.8rem;background:#fff;}
        .field-block{display:flex;align-items:flex-start;margin-top:0.4rem;}
        .field-block label{width:120px;font-size:0.9rem;font-weight:500;padding-top:0.3rem;}
        .notes-wrapper{flex:1;display:flex;flex-direction:column;}
        .notes-area{border:1px solid #ccc;border-radius:4px;padding:0.5rem;font-size:0.9rem;line-height:1.4;color:#000;min-height:110px;resize:vertical;white-space:pre-wrap;}
        .notes-buttons{display:flex;gap:0.4rem;margin-top:0.3rem;}
        .save-btn,.quick-btn{background:#0a2b5c;color:#fff;border:none;border-radius:4px;padding:0.3rem 0.6rem;cursor:pointer;font-size:0.8rem;}
        .quick-btn{background:#17428a;}
        .save-btn:hover{background:#17428a;}
        .quick-btn:hover{background:#265ac1;}
        .status-buttons{display:flex;gap:0.5rem;margin-bottom:0.3rem;}
        button{background:#0a2b5c;color:#fff;border:none;padding:0.35rem 0.7rem;border-radius:4px;cursor:pointer;}
        button:hover{background:#17428a;}
        .action-row{display:flex;justify-content:space-between;margin-top:1rem;padding-bottom:0.4rem;}
        /* === Audit additions === */
        .audit-actions{display:flex;gap:0.5rem;margin-top:1rem;margin-bottom:0.5rem;}
        .input-row{display:flex;align-items:center;margin-bottom:0.6rem;}
        .input-row input{flex:1;padding:0.4rem;border:1px solid #ccc;border-radius:4px;font-size:0.9rem;}
        .cancel-btn{margin-left:0.3rem;background:#888;}
        .audit-panel{border:1px solid #ccc;border-radius:8px;background:#fafafa;padding:0.5rem 0.8rem;}
        .audit-panel h4{margin:0 0 0.4rem 0;color:#0a2b5c;font-size:1rem;text-align:left;}
        .audit-log{max-height:220px;overflow-y:auto;border:1px solid #e0e0e0;border-radius:6px;background:#fff;padding:0.4rem;}
        .audit-line{display:flex;justify-content:space-between;align-items:center;padding:0.25rem 0.4rem;font-size:0.9rem;border-bottom:1px solid #f1f1f1;}
        .audit-line:nth-child(even){background:#f7f9fb;}
        .audit-icon{margin-right:0.5rem;}
        .audit-text{flex:1;color:#222;}
        .audit-time{font-size:0.8rem;color:#666;margin-left:0.5rem;white-space:nowrap;}
        .audit-empty{text-align:center;color:#888;font-size:0.9rem;padding:0.4rem 0;}
      `}</style>
    </div>
  );
}
