/* === METRA Phase 9.9A.6 – Inline Embedded Timestamps (Unified PreProject Format) ===
   Change Control Popup
   - Unified 🕓 DD Mon YYYY HH:MM UTC format across all modules
   - Inline timestamp appended inside text boxes on Save/Enter
   - Legacy "Updated"/"Status →" entries auto-normalised on load
--------------------------------------------------------------- */

import React, { useState, useEffect } from "react";

export default function TaskPopupChangeTest() {
  const STORAGE_KEY = "metra_change_steps_v9_9A6";

  // --- shared UTC formatter ---
  const metraTimestamp = () => {
    const d = new Date();
    const day = d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const time = d.toLocaleTimeString("en-GB", { hour12: false });
    return `🕓 ${day} ${time} UTC`;
  };

  const defaultSteps = [
    { id: 1, title: "Impact Assessment", status: "Not Started", notes: "", email: "", link: "", open: false },
    { id: 2, title: "Board Review", status: "Not Started", notes: "", email: "", link: "", open: false },
    { id: 3, title: "Implementation Verification", status: "Not Started", notes: "", email: "", link: "", open: false },
  ];

  const [steps, setSteps] = useState(defaultSteps);
  const [dirty, setDirty] = useState({});

  // --- normalise any older timestamp text ---
  const normaliseText = (txt) => {
    if (!txt) return "";
    let t = txt;
    t = t.replace(/Updated\s*/gi, "");
    t = t.replace(/Status\s*→\s*/gi, "");
    t = t.replace(/–/g, ""); // remove dash variants
    t = t.replace(/\s+UTC/g, " UTC");
    t = t.replace(/\n\n+/g, "\n"); // collapse gaps
    return t.trim();
  };

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored).map((s) => ({
        ...s,
        notes: normaliseText(s.notes),
        email: normaliseText(s.email),
        link: normaliseText(s.link),
      }));
      setSteps(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(steps));
  }, [steps]);

  const toggleOpen = (id) =>
    setSteps((p) => p.map((s) => (s.id === id ? { ...s, open: !s.open } : s)));

  const markDirty = (id, f, v) => setDirty((p) => ({ ...p, [`${id}_${f}`]: v }));

  // --- embed timestamp inside field on Save or Enter ---
  const handleSave = (id, field) => {
    const stamp = metraTimestamp();
    setSteps((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, [field]: `${s[field].trim()}\n${stamp}`.trim() }
          : s
      )
    );
    setDirty((p) => ({ ...p, [`${id}_${field}`]: false }));
  };

  const handleStatus = (id, status) => {
    const stamp = metraTimestamp();
    setSteps((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status, notes: `${s.notes}\n${stamp}`.trim() }
          : s
      )
    );
  };

  const addStep = () => {
    const now = metraTimestamp();
    const newStep = {
      id: Date.now(),
      title: "New Step",
      status: "Not Started",
      notes: `${now}`,
      email: "",
      link: "",
      open: true,
    };
    setSteps((p) => [...p, newStep]);
  };

  const resetToDefault = () => {
    if (window.confirm("Reset to default steps? (Local only)")) {
      localStorage.removeItem(STORAGE_KEY);
      setSteps(defaultSteps);
    }
  };

  return (
    <div className="popup-container">
      <div className="popup-header">Change</div>
      <div className="popup-subheader">
        <strong>Change Matter:</strong> Cable Routing Review
      </div>

      <div className="popup-content">
        {steps.map((s) => (
          <div key={s.id} className="step-card">
            <div className="step-row" onClick={() => toggleOpen(s.id)}>
              <span className="caret">{s.open ? "▾" : "▸"}</span>
              <input
                className="title-edit"
                value={s.title}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  setSteps((p) =>
                    p.map((x) =>
                      x.id === s.id ? { ...x, title: e.target.value } : x
                    )
                  )
                }
                onBlur={() => handleSave(s.id, "title")}
              />
              <span className="status-label">{s.status}</span>
            </div>

            <div
              className="expandable"
              style={{
                maxHeight: s.open ? "650px" : "0",
                transition: "max-height 0.35s ease",
                overflow: "hidden",
              }}
            >
              <div className="expand-inner">
                <div className="collapse-line">
                  <span className="collapse-cue" onClick={() => toggleOpen(s.id)}>
                    ▲
                  </span>
                </div>

                <div className="status-buttons">
                  <button onClick={() => handleStatus(s.id, "Started")}>Start</button>
                  <button onClick={() => handleStatus(s.id, "Completed")}>Complete</button>
                  <button onClick={() => handleStatus(s.id, "Not Started")}>Reset</button>
                </div>

                {["notes", "email", "link"].map((f) => (
                  <div key={f} className="field-block">
                    <label>
                      {f === "notes"
                        ? "Notes / Comms"
                        : f === "email"
                        ? "📧 Email Ref"
                        : "🔗 Document Link"}
                    </label>
                    {f === "notes" ? (
                      <textarea
                        rows="5"
                        value={s[f]}
                        onChange={(e) => {
                          setSteps((p) =>
                            p.map((x) =>
                              x.id === s.id ? { ...x, [f]: e.target.value } : x
                            )
                          );
                          markDirty(s.id, f, true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.metaKey) handleSave(s.id, f);
                        }}
                      />
                    ) : (
                      <input
                        type={f === "link" ? "url" : "text"}
                        value={s[f]}
                        placeholder={
                          f === "email"
                            ? "e.g. Email sent 25 Oct re: approval"
                            : "https://"
                        }
                        onChange={(e) => {
                          setSteps((p) =>
                            p.map((x) =>
                              x.id === s.id ? { ...x, [f]: e.target.value } : x
                            )
                          );
                          markDirty(s.id, f, true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSave(s.id, f);
                        }}
                      />
                    )}
                    {dirty[`${s.id}_${f}`] && (
                      <button className="save-btn" onClick={() => handleSave(s.id, f)}>
                        💾 Save
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="action-row">
          <button onClick={addStep}>➕ Add Step</button>
          <button onClick={resetToDefault}>🔄 Reset to Default</button>
        </div>
      </div>

      <style jsx>{`
        .popup-container {
          background:#fff;border-radius:8px;width:90%;max-width:720px;
          margin:auto;box-shadow:0 0 8px rgba(0,0,0,0.1);
          overflow-y:auto;max-height:80vh;
        }
        .popup-header {
          background:#0a2b5c;color:#fff;font-weight:bold;
          padding:0.5rem 1rem;border-radius:6px 6px 0 0;text-align:center;
        }
        .popup-subheader {
          background:#eef1f6;padding:0.5rem 1rem;border-bottom:1px solid #ddd;
          font-size:0.95rem;
        }
        .popup-content { padding:1rem; }
        .step-card {
          border:1px solid #ddd;border-radius:6px;
          margin-bottom:0.7rem;background:#f9fafc;
        }
        .step-row {
          display:flex;align-items:center;cursor:pointer;
          padding:0.5rem;background:#eef3fb;border-radius:6px;font-weight:600;
        }
        .caret{width:20px;text-align:center;}
        .title-edit{
          flex:1;border:none;background:transparent;
          border-bottom:1px solid #ccc;outline:none;
          font-size:0.95rem;font-weight:600;
        }
        .status-label{font-size:0.85rem;color:#333;margin-left:0.4rem;}
        .collapse-line{display:flex;justify-content:flex-end;}
        .collapse-cue{cursor:pointer;color:#0a2b5c;}
        .expand-inner{padding:0.6rem 0.8rem;background:#fff;}
        .field-block{display:flex;align-items:center;margin-top:0.4rem;}
        .field-block label{width:120px;font-size:0.9rem;font-weight:500;}
        .field-block textarea,.field-block input{
          flex:1;border:1px solid #ccc;border-radius:4px;
          padding:0.4rem;font-size:0.9rem;font-family:inherit;
          white-space:pre-wrap;color:#000;
        }
        .field-block textarea::-webkit-scrollbar{width:6px;}
        .field-block textarea::-webkit-scrollbar-thumb{
          background:#ccc;border-radius:3px;
        }
        .save-btn{
          margin-left:0.4rem;background:#0a2b5c;color:#fff;
          border:none;border-radius:4px;padding:0.3rem 0.6rem;
          cursor:pointer;font-size:0.8rem;
        }
        .save-btn:hover{background:#17428a;}
        .status-buttons{display:flex;gap:0.5rem;margin-bottom:0.3rem;}
        button{background:#0a2b5c;color:#fff;border:none;
          padding:0.35rem 0.7rem;border-radius:4px;cursor:pointer;}
        button:hover{background:#17428a;}
        .action-row{display:flex;justify-content:space-between;
          margin-top:1rem;padding-bottom:0.4rem;}
        textarea{color:#000;}
      `}</style>
    </div>
  );
}
