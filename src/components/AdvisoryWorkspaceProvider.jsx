// @ts-nocheck
/*
======================================================================

METRA — AdvisoryWorkspaceProvider.jsx
Stage 500K-1A — Advisory Workspace Provider Foundation

PURPOSE
-------
Constitutional owner of the Advisory Workspace lifecycle.

Stage 500K introduces the provider as the constitutional
destination for the Advisory Workspace lifecycle.

Initially this provider delegates to the existing legacy
implementation.

Subsequent bounded migrations will relocate:

• Governance state
• Governance lifecycle
• Governance provider boundary

from TaskPopup into this provider.

No constitutional behaviour changes occur in this stage.

======================================================================
*/

import TaskPopup from "./TaskPopup";

export default function AdvisoryWorkspaceProvider(props) {

  /*
  ==========================================================

  ADVISORY WORKSPACE LIFECYCLE

  This region will progressively become the constitutional
  owner of:

  • Governance state
  • Governance surface opening
  • Governance lifecycle
  • Governance provider boundary

  ==========================================================
  */

  /*
  ==========================================================

  CONSTITUTIONAL ADVISORY ENTRY

  The provider is the constitutional owner of advisory entry.

  Subsequent stages will progressively assemble the advisory
  context here before delegating behavioural responsibility.

  ==========================================================
  */

  const advisoryContext = {
    ...props
  };

  return (
  <TaskPopup
    {...advisoryContext}
    advisoryEntry={true}
  />
);
}
