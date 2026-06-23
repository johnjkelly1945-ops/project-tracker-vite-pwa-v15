// @ts-nocheck
import { createPortal } from "react-dom";

import {
  resolvePersonnelExperience
} from "../domain/personnel/PersonnelParticipationResolver";

export default function ExperienceModal({ person, onClose }) {
  if (!person) return null;

  const experience =
    resolvePersonnelExperience(person);

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
        <strong>Experience</strong>

        <div style={{ marginTop: "12px" }}>
          <div>
            <strong>Personnel:</strong>{" "}
            {person.displayName || person.title || "Unknown"}
          </div>

          <div style={{ marginTop: "12px" }}>
            {experience.length === 0 ? (
              <div>No experience recorded.</div>
            ) : (
              experience.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "6px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <strong>{item.role}</strong>: {item.count}
                </div>
              ))
            )}
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
