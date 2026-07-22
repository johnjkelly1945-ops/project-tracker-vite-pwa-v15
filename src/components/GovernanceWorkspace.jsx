// @ts-nocheck
/*
======================================================================

METRA — GovernanceWorkspace.jsx
Stage 500T-2 — Governance Workspace Foundation

PURPOSE
-------

Constitutional destination for Governance Workspace lifecycle.

Initially delegates to the existing TaskPopup implementation.

Subsequent bounded migrations will relocate:

• Governance register lifecycle
• Governance event lifecycle
• Governance navigation
• Escalation navigation

No constitutional behaviour changes occur in this stage.

======================================================================
*/

import TaskPopup from "./TaskPopup";

export default function GovernanceWorkspace(props) {
  return <TaskPopup {...props} />;
}
