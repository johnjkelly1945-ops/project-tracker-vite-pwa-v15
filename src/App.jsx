import React from "react";
import Checklist from "./Checklist";
import Personnel from "./Personnel";
import "./App.css";

export default function App() {
  const projectPhases = [
    {
      title: "Pre-Project",
      items: [
        { text: "Cost benefit analysis completed", status: "Not started" },
        { text: "Feasibility study approved", status: "Not started" },
        { text: "Project charter signed", status: "Not started" }
      ]
    },
    {
      title: "Planning",
      items: [
        { text: "Requirements gathered", status: "Not started" },
        { text: "Timeline created", status: "Not started" },
        { text: "Resources allocated", status: "Not started" }
      ]
    },
    {
      title: "Execution",
      items: [
        { text: "Development started", status: "Not started" },
        { text: "Testing ongoing", status: "Not started" },
        { text: "Regular updates provided", status: "Not started" }
      ]
    },
    {
      title: "Closure",
      items: [
        { text: "Deliverables signed off", status: "Not started" },
        { text: "Team released", status: "Not started" },
        { text: "Lessons learned completed", status: "Not started" }
      ]
    }
  ];

  return (
    <div className="app">
      <h1>Project Tracker v2</h1>

      {/* Pre-Project */}
      <Checklist title={projectPhases[0].title} items={projectPhases[0].items} />

      {/* Personnel goes here */}
      <Personnel />

      {/* Rest of the phases */}
      {projectPhases.slice(1).map((phase, index) => (
        <Checklist key={index} title={phase.title} items={phase.items} />
      ))}
    </div>
  );
}

