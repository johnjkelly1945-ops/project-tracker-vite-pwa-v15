import React from "react";
import "../Styles/ModuleHeader.css";

export default function ModuleHeader({ loadPreProject, loadRepository }) {

  console.log(">>> ModuleHeader.jsx from COMPONENTS loaded");

  return (
    <div className="mh-wrapper">
      <div className="mh-title">METRA</div>

      <div className="mh-buttons">

        <button
          className="mh-btn"
          onClick={() => {
            console.log(">>> PreProject button clicked (COMPONENTS)");
            loadPreProject();
          }}
        >
          Pre-Project
        </button>

        <button
          className="mh-btn"
          onClick={() => {
            console.log(">>> Repository button clicked (COMPONENTS)");
            loadRepository();
          }}
        >
          Repository
        </button>

      </div>
    </div>
  );
}
