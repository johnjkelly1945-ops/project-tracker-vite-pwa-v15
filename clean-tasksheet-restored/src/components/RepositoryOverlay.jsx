import React, { useEffect } from "react";
import TaskRepositorySandbox from "../sandbox/repo-integration/TaskRepositorySandbox.jsx";

export default function RepositoryOverlay({ onClose, onAddToWorkspace }) {

  useEffect(() => {
    console.log("🟣 RepositoryOverlay mounted");
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 2000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div style={{ background: "#fff", width: "80%", height: "80%" }}>
        <TaskRepositorySandbox
          onClose={onClose}
          onAddToWorkspace={onAddToWorkspace}
        />
      </div>
    </div>
  );
}
