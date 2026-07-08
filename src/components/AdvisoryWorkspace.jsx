// @ts-nocheck
/*
======================================================================

METRA — AdvisoryWorkspace.jsx
Stage 500J-1 — Advisory Constitutional Workspace

PURPOSE
-------
Constitutional workspace for advisory actors.

This workspace is entered directly from the
Constitutional Workspace Router.

Stage 500J introduces the constitutional destination.
Subsequent mutations will relocate advisory functionality
from TaskPopup into this workspace.

======================================================================
*/

import TaskPopup from "./TaskPopup";

export default function AdvisoryWorkspace(props) {
  return <TaskPopup {...props} />;
}
