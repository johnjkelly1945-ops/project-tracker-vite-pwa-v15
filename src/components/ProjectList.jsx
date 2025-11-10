import React from "react";
import "./Styles/Checklist.css";

function PreProject() {
  return (
    <div className="checklist">
      <h2>Pre-Project Planning</h2>
      <ul>
        <li>Cost benefit analysis completed <button>Delete</button></li>
        <li>Feasibility study approved <button>Delete</button></li>
        <li>Project charter signed <button>Delete</button></li>
      </ul>
      <div className="add-task">
        <input type="text" placeholder="Add task" />
        <button>Add</button>
      </div>
    </div>
  );
}

// export default PreProject;
