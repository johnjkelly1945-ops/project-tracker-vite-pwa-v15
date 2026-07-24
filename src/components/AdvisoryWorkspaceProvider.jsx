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

import { useState } from "react";
import TaskPopup from "./TaskPopup";
import { getActingUser } from "../domain/actor/ActingUser";
import { resolveAdvisoryNavigation } from "../domain/governance/AdvisoryNavigationResolver";

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

  const advisoryEngagement =
    props.activeAdvisory;

  const advisoryNavigation =
    resolveAdvisoryNavigation({
      actor: getActingUser(),
      taskId: props.task?.id
    });

  const resolvedAdvisoryEngagement =
    advisoryEngagement ||
    advisoryNavigation[0] ||
    null;

  function openConstitutionalDestination() {
    /*
    ==========================================================

    CONSTITUTIONAL EXECUTION

    Progressive destination execution will migrate into this
    service from TaskPopup.

    Stage 500K-6A establishes the constitutional execution
    boundary only.

    ==========================================================
    */
    if (!resolvedAdvisoryEngagement) return;

    const destination =
      resolvedAdvisoryEngagement.eventType;

    const destinationId =
      resolvedAdvisoryEngagement.eventId;

  }

  const advisoryContext = {
    ...props,
    advisoryDestination:
      resolvedAdvisoryEngagement?.eventType || null,
    advisoryDestinationId:
      resolvedAdvisoryEngagement?.eventId || null
  };


  openConstitutionalDestination();

  return (
  <TaskPopup
    {...advisoryContext}
    advisoryEntry={true}
  />
);
}
