import React from "react";

export default function TemplateLinks() {
  const templates = [
    { name: "Project Charter", url: "#" },
    { name: "Project Plan", url: "#" },
    { name: "Risk Register", url: "#" },
  ];

  const handleClick = (name) => {
    alert(`You clicked on ${name}`);
  };

  return (
    <div className="template-links box">
      <h2>Templates</h2>
      <ul>
        {templates.map((t) => (
          <li key={t.name}>
            <button onClick={() => handleClick(t.name)}>{t.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
/* ======================================================================
   METRA – TemplateLinks.jsx
   v2 – JSON-driven template list loader
   ----------------------------------------------------------------------
   • Loads templates from public/templates/templates.json
   • Returns them in a clean array for use by TemplateAttachPopup
   • Baseline-safe: NO UI added here, only provides data
   ====================================================================== */

import React, { useEffect, useState } from "react";

export default function TemplateLinks({ onLoaded }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function loadTemplates() {
      try {
        const res = await fetch("/templates/templates.json");
        const data = await res.json();
        setItems(data);

        if (onLoaded) onLoaded(data);
      } catch (err) {
        console.error("Failed to load templates.json:", err);
      }
    }

    loadTemplates();
  }, [onLoaded]);

  return null; // This component is non-visual
}
