/*
======================================================================

METRA — WorkspaceSurface.jsx
Stage 500W — Constitutional Workspace Presentation Surface

PURPOSE
-------
Shared presentation boundary for constitutional workspaces.

Owns:
• viewport containment
• overlay presentation
• workspace sizing

Does not own:
• routing
• authority
• lifecycle
• domain behaviour

======================================================================
*/

export default function WorkspaceSurface({ children }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.3)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "90%",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "6px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
