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
