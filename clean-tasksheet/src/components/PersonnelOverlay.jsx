import React from "react";
import { PersonnelBridge } from "./Bridge/PersonnelBridge.js";
import "../Styles/PreProject.css";

export default function PersonnelOverlay({ onClose, onSelect }) {
  // Load personnel and filter active users
  const people = PersonnelBridge.getPersonnel().filter(p => p.active);

  return (
    <div className="overlay-backdrop">
      <div className="overlay-card">
        <h2>Select Personnel</h2>

        <div className="person-list">
          {people.map((p) => {
            const line1 = p.role || p.organisation || p.department
              ? [p.role, p.organisation, p.department].filter(Boolean).join(" • ")
              : null;

            const line2 = p.telephone || p.email
              ? [p.telephone, p.email].filter(Boolean).join(" • ")
              : null;

            return (
              <button
                key={p.id}
                className="person-btn"
                onClick={() => onSelect(p.name)}
                style={{ textAlign: "left", lineHeight: "1.4" }}
              >
                <strong>{p.name}</strong>

                {line1 && (
                  <>
                    <br />
                    <span style={{ fontSize: "0.85rem", opacity: 0.9 }}>
                      {line1}
                    </span>
                  </>
                )}

                {line2 && (
                  <>
                    <br />
                    <span style={{ fontSize: "0.75rem", opacity: 0.75 }}>
                      {line2}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        <button className="close-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
