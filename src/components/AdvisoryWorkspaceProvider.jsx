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

import { useState, useEffect } from "react";
import { getActingUser } from "../domain/actor/ActingUser";
import { getGovernanceEvent } from "../governance/governanceStore";
import { bridgeSubmitAdvisory } from "../governance/governanceBridge";

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



  const [advisoryEvent, setAdvisoryEvent] = useState(null);
  const [advisoryText, setAdvisoryText] = useState("");




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

    const resolvedAdvisoryEngagement =
      props.constitutionalEngagement?.responsibility === "Advisory"
        ? {
            eventId: props.constitutionalEngagement.governanceEventId,
            eventType: props.constitutionalEngagement.governanceEventType
          }
        : null;


    useEffect(() => {
      if (!resolvedAdvisoryEngagement?.eventId) return;

      const loaded = getGovernanceEvent(
        resolvedAdvisoryEngagement.eventId
      );

      if (loaded) {
        setAdvisoryEvent(loaded);
      }
    }, [resolvedAdvisoryEngagement?.eventId]);

    const advisoryTypes = resolvedAdvisoryEngagement
      ? [resolvedAdvisoryEngagement.eventType]
      : [];


    const actor = getActingUser();

      const isAdvisor =
        props.constitutionalEngagement?.responsibility === "Advisory";

  console.log("STAGE500W PROVIDER", {
    taskId: props.task?.id,
    resolvedAdvisoryEngagement,
    advisoryTypes
  });

    console.log("STAGE500W CONTRACT IN PROVIDER", props.constitutionalEngagement);





      function handleCommitAdvisory() {
        const summary = advisoryText.trim();
        if (!summary) return;
        if (!resolvedAdvisoryEngagement?.eventId) return;

        const updated = bridgeSubmitAdvisory({
          eventId: resolvedAdvisoryEngagement.eventId,
          submittedBy: "PM",
          summary,
          artefactId: null,
          templateId: null,
        });

        setAdvisoryEvent(updated);
        setAdvisoryText("");
      }

  const advisoryContext = {
    ...props,
  };



    console.log("STAGE500W PROVIDER RENDER", { isAdvisor, advisoryTypes });


  return (
  <>


        {isAdvisor && resolvedAdvisoryEngagement && (
          <div>
            <h3>Advisory</h3>

            {(advisoryEvent?.advisoryRecords || []).map((adv) => (
              <div key={adv.advisoryId}>
                {adv.summary}
              </div>
            ))}

            {!props.readOnly && (
              <>
                <textarea
                  value={advisoryText}
                  onChange={(e) => setAdvisoryText(e.target.value)}
                  placeholder="Enter advisory..."
                />

                <button onClick={handleCommitAdvisory}>
                  Commit advisory
                </button>
              </>
            )}

            <button onClick={props.onClose}>
              Return to MW
            </button>
          </div>
        )}

    </>
  );
}
