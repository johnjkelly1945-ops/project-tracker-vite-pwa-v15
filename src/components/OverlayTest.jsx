import React, { useState } from "react";
import "../Styles/PreProject.css";

export default function OverlayTest() {
  const [show, setShow] = useState(false);

  return (
    <div className="preproject-wrapper">
      <h1>Overlay Visibility Test</h1>
      <button
        onClick={() => setShow(true)}
        style={{
          padding: "8px 16px",
          borderRadius: "8px",
          border: "none",
          background: "#0a2b5c",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Open Overlay
      </button>

      {show && (
        <div className="overlay-backdrop">
          <div className="overlay-container">
            <h2>Overlay Test</h2>
            <p>Do you see a dark background dimming the page?</p>
            <button
              onClick={() => setShow(false)}
              className="overlay-close-btn"
            >
              ✖ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
