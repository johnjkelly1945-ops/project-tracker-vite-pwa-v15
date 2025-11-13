import React from "react";
import "../Styles/PreProject.css";

export default function PersonnelOverlay({ onClose, onSelect }) {
  const people = ["John", "Mary", "Alex"]; // Simple test dataset

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div
        className="overlay-card"
        onClick={(e) => e.stopPropagation()} // Prevent closing on card click
      >
        <h2>Select Person</h2>

        <div className="person-list">
          {people.map((p) => (
            <button
              key={p}
              className="person-btn"
              onClick={() => onSelect(p)}
            >
              {p}
            </button>
          ))}
        </div>

        <button className="close-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
