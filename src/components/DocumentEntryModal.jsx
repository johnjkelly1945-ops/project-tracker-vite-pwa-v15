// @ts-nocheck
import React, { useState } from "react";

export default function DocumentEntryModal({ open, onClose, onConfirm }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  if (!open) return null;

  const handleAdd = () => {
    if (!name.trim()) {
      alert("Document name is required");
      return;
    }

    onConfirm({
      name: name.trim(),
      location: location.trim(),
    });

    setName("");
    setLocation("");
    onClose();
  };

  const handleCancel = () => {
    setName("");
    setLocation("");
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "420px",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          position: "relative",
        }}
      >
        {/* Close (X) */}
        <div
          onClick={handleCancel}
          style={{
            position: "absolute",
            top: "10px",
            right: "12px",
            cursor: "pointer",
            fontSize: "18px",
            color: "#666",
          }}
        >
          ×
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: "15px",
          }}
        >
          Add Document
        </div>

        {/* Name */}
        <div style={{ marginBottom: "12px" }}>
          <div style={{ fontSize: "13px", marginBottom: "4px" }}>
            Document name
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Contract v3"
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "14px",
            }}
          />
        </div>

        {/* Location */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "13px", marginBottom: "4px" }}>
            Location (link or reference)
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Paste URL or describe where to find it"
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "14px",
            }}
          />
          <div style={{ fontSize: "11px", color: "#777", marginTop: "4px" }}>
            Optional — used if the document cannot be opened directly
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            onClick={handleAdd}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "none",
              background: "#1976d2",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Add
          </button>

          <button
            onClick={handleCancel}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
