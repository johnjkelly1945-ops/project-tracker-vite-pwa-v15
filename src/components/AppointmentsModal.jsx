// @ts-nocheck
import { useState } from "react";
import { createPortal } from "react-dom";

import { resolvePersonnelParticipation } from "../domain/personnel/PersonnelParticipationResolver";
import { resolvePersonnelObservation } from "../domain/personnel/PersonnelObservationResolver";

export default function AppointmentsModal({ person, onClose }) {
  const [view, setView] = useState("participation");

  if (!person) return null;

  const participation = resolvePersonnelParticipation(person);
  const observation = resolvePersonnelObservation();

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
        width: "600px",
        maxHeight: "80vh",
        overflowY: "auto",
        padding: "20px",
        borderRadius: "8px"
      }}>
        <strong>Appointments</strong>

        <div style={{ marginTop: "12px" }}>
          <div>
            <strong>Personnel:</strong>{" "}
            {person.displayName || person.title || "Unknown"}
          </div>

          <div style={{ marginTop: "12px" }}>
            <select
              value={view}
              onChange={(e) => setView(e.target.value)}
            >
              <option value="participation">
                Participation
              </option>
              <option value="observation">
                Observation
              </option>
            </select>
          </div>

          {view === "participation" && (
            <div style={{ marginTop: "16px" }}>
              {participation.length === 0 ? (
                <div>No participation records.</div>
              ) : (
                participation.map((item, idx) => (
                  <div key={idx}>
                    {item.role} — {item.status}
                  </div>
                ))
              )}
            </div>
          )}

          {view === "observation" && (
            <div style={{ marginTop: "16px" }}>
              {observation.map((item, idx) => (
                <div key={idx}>
                  {item.surface} — {item.status}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: "16px", textAlign: "right" }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
