// @ts-nocheck
import React from "react";

export default function DocumentModal({ document, onClose }) {
  if (!document) return null;

  const title = document.name || document.title || "Untitled";

  const rawUrl = document.url || "";
  const url = rawUrl
    ? (rawUrl.startsWith("http") || rawUrl.startsWith("mailto:")
        ? rawUrl
        : `https://${rawUrl}`)
    : null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999999
    }}>
      <div style={{
        background: "white",
        padding: "20px",
        width: "420px",
        borderRadius: "8px"
      }}>
        <h3 style={{ marginTop: 0 }}>Document</h3>

        <div style={{ marginBottom: "10px" }}>
          <strong>Name:</strong> {title}
        </div>

        {url && (
          <div style={{ marginBottom: "10px" }}>
            <strong>Link:</strong> {url}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          {url && (
            <button onClick={() => window.open(url, "_blank")}>
              Open Link
            </button>
          )}
          <button onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
