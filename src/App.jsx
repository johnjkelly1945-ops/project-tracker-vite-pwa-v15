import React from "react";

export default function App() {
  console.log("🧩 Fresh isolated App.jsx loaded at runtime");
  return (
    <div style={{padding:"2rem",textAlign:"center"}}>
      <h1>Isolated App.jsx Render</h1>
      <p>If you can see this text, Vite is now reading the new file.</p>
    </div>
  );
}
