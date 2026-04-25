// @ts-nocheck
import React from "react";

export default function RegisterItemView({ item, onClose }) {
  if (!item) return null;

  const formattedDate = item.createdOn
    ? new Date(item.createdOn).toLocaleString()
    : "—";

  const val = (v) => (v && v !== "" ? v : "—");

  const fieldStyle = {
    width: "100%",
    marginBottom: "12px",
    padding: "8px",
    background: "#f9f9f9",
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: "bold",
    marginBottom: "4px",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2147483647,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "24px",
          width: "640px",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "10px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
        }}
      >
        {/* HEADER */}
        <h2 style={{ marginBottom: "16px" }}>
          {val(item.changeId || item.reference)} — {val(item.title)}
        </h2>

        {/* SCROLLABLE CONTENT */}
        <div style={{ overflowY: "auto", paddingRight: "8px" }}>

          <div style={labelStyle}>Title</div>
          <input value={val(item.title)} readOnly style={fieldStyle} />

          <div style={labelStyle}>Description</div>
          <textarea
            value={val(item.description)}
            readOnly
            style={{ ...fieldStyle, minHeight: "60px" }}
          />

          <div style={labelStyle}>Severity</div>
          <input value={val(item.severity)} readOnly style={fieldStyle} />

          <div style={labelStyle}>Impact</div>
          <input value={val(item.impact)} readOnly style={fieldStyle} />

          <div style={labelStyle}>Owner</div>
          <input
            value={val(item.owner || item.createdBy)}
            readOnly
            style={fieldStyle}
          />

          <div style={labelStyle}>Mitigation</div>
          <textarea
            value={val(item.mitigation)}
            readOnly
            style={{ ...fieldStyle, minHeight: "60px" }}
          />

          <div style={{ marginTop: "12px", fontSize: "13px", color: "#666" }}>
            <div><strong>Status:</strong> {val(item.state)}</div>
            <div><strong>Created On:</strong> {formattedDate}</div>
          </div>

        </div>

        {/* FOOTER (STICKY) */}
        <div
          style={{
            textAlign: "right",
            marginTop: "12px",
            position: "sticky",
            bottom: 0,
            background: "#fff",
            paddingTop: "8px",
          }}
        >
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
