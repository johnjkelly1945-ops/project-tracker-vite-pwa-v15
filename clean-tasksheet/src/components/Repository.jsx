// Temporary placeholder until full module is installed
import React from "react";

export default function Repository({ setScreen }) {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Repository Module Placeholder</h1>
      <p>This is a temporary file so the app compiles correctly.</p>

      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px"
        }}
        onClick={() => setScreen("preproject")}
      >
        Return to PreProject
      </button>
    </div>
  );
}
