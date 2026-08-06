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

• Advisory state
• Advisory lifecycle
• Advisory workspace boundary

Advisory lifecycle ownership is now contained within this provider.

No constitutional behaviour changes occur in this stage.

======================================================================
*/

import { getActingUser } from "../domain/actor/ActingUser";
import { resolveAdvisoryNavigation } from "../domain/governance/AdvisoryNavigationResolver";

import ReviewModal from "./ReviewModal";

export default function AdvisoryWorkspaceProvider(props) {

  /*
  ==========================================================

  ADVISORY WORKSPACE LIFECYCLE

  This region is the constitutional
  owner of:

  • Advisory state
  • Advisory engagement resolution
  • Advisory lifecycle
  • Advisory workspace boundary

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
      props.constitutionalEngagement?.responsibility === "Advisory"
        ? {
            eventId: props.constitutionalEngagement.governanceEventId,
            eventType: props.constitutionalEngagement.governanceEventType
          }
        : null;
    const advisoryTypes = resolvedAdvisoryEngagement
      ? [resolvedAdvisoryEngagement.eventType]
      : [];


      const resolvedAdvisoryTypes =
        advisoryTypes.length > 0
          ? advisoryTypes
          : [
              ...new Set(
                advisoryNavigation.map(e => e.eventType)
              )
            ];


    const actor = getActingUser();

      const isAdvisor =
  props.constitutionalEngagement?.responsibility === "Advisory";

const advisoryContext = {
    ...props,
  };

  return (
  <>


          {isAdvisor && resolvedAdvisoryEngagement && (
            <ReviewModal
              taskId={props.task?.id}
              taskTitle={props.task?.title}
              eventId={resolvedAdvisoryEngagement.eventId}
              readOnly={props.readOnly}
              onClose={props.onClose}
              onAddNote={props.onAddNote}
            />
          )}

    </>
  );
}
