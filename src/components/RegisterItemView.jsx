// @ts-nocheck
import React from "react";

export default function RegisterItemView({ item, onClose }) {
  if (!item) return null;

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
        pointerEvents: "auto"
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          width: "500px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          {item.changeId || item.reference} — {item.title || "Untitled"}
        </h3>

        <div style={{ marginBottom: "12px", color: "#555" }}>
          {item.description || "No description"}
        </div>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
