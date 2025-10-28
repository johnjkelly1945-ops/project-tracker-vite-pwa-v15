import React, { useState, useEffect } from "react";
import PopupUniversal from "./PopupUniversal.jsx";

export default function PopupUniversalTest() {
  const [show, setShow] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);

  const storageKey = "metra_popup_universal";

  // ✅ Detect if saved data exists on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setHasSavedData(true);
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#eef2f7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2 style={{ color: "#0a2b5c", marginBottom: "20px" }}>
        METRA – Universal Popup Framework Test
      </h2>

      <button
        onClick={() => setShow(true)}
        style={{
          background: "#0a2b5c",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        {hasSavedData ? "Open Popup (Restored Data)" : "Open Popup"}
      </button>

      <PopupUniversal
        visible={show}
        onClose={() => setShow(false)}
        taskTitle="Demo Task"
        section="Universal Test"
        storageKey={storageKey}
        onSave={() => setHasSavedData(true)}
      />
    </div>
  );
}
