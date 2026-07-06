// @ts-nocheck
/*
======================================================================

METRA — TaskSelectionSurface.jsx
Stage 500H-8B — Task Selection Surface Extraction

PURPOSE
-------
Constitutional operational workspace entry.

Currently performs a transparent projection to TaskPopup.

Future stages will determine the appropriate constitutional
workspace without requiring App.jsx to make that decision.

CONSTITUTIONAL RULES
--------------------
• App coordinates application state.
• TaskSelectionSurface selects the operational surface.
• TaskPopup remains the operational workspace.
• No repository mutation.
• No constitutional decision.
• No behavioural change.

======================================================================
*/

import TaskPopup from "./TaskPopup";

export default function TaskSelectionSurface(props) {
  return <TaskPopup {...props} />;
}
