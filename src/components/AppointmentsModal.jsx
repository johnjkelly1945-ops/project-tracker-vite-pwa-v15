// @ts-nocheck
import { createPortal } from "react-dom";

export default function AppointmentsModal({ person, onClose }) {
  if (!person) return null;

  return createPortal(
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.45)",
      zIndex: 1000003,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        background: "#fff",
        width: "420px",
        padding: "20px",
        borderRadius: "8px"
      }}>
        <strong>Appointments</strong>

        <div style={{ marginTop: "12px" }}>
          <div><strong>Personnel:</strong> {person.displayName || person.title || "Unknown"}</div>
          <div style={{ marginTop: "12px" }}>
            Appointments functionality will be implemented in a subsequent phase.
          </div>
        </div>

        <div style={{ marginTop: "16px", textAlign: "right" }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
