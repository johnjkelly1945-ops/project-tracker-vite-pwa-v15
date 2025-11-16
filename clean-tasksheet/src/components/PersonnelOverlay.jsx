/* ======================================================================
   METRA – PersonnelOverlay.jsx (FINAL WORKING VERSION)
   Sends full person object → PreProject receives { id, name }
   Assignment works: Chrome + Safari
   ====================================================================== */

import React from "react";
import "../Styles/PreProject.css";

export default function PersonnelOverlay({ onSelect, onClose }) {

  const people = [
    { id: "pers-alice-robertson", name: "Alice Robertson" },
    { id: "pers-bob-mckenzie", name: "Bob McKenzie" },
    { id: "pers-charlie-nguyen", name: "Charlie Nguyen" },
    { id: "pers-dana-patel", name: "Dana Patel" }
  ];

  return (
    <div className="ww-backdrop">
      <div
        style={{
          width: "320px",
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.25)"
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "12px" }}>Assign Person</h3>

        {people.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelect(p)}   // <-- SEND FULL PERSON OBJECT
            style={{
              padding: "10px",
              borderBottom: "1px solid #ddd",
              cursor: "pointer"
            }}
          >
            {p.name}
          </div>
        ))}

        <button
          onClick={onClose}
          style={{
            marginTop: "14px",
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            background: "#f2f2f2",
            cursor: "pointer"
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
