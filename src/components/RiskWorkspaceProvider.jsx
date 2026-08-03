// @ts-nocheck

/*
======================================================================

METRA — RiskWorkspaceProvider.jsx
Stage 500V — Constitutional Risk Workspace Provider

PURPOSE
-------
Constitutional owner of the Risk Workspace lifecycle.

The provider owns Risk workspace entry and event opening.

The Risk capability remains the underlying governance surface.

======================================================================
*/

import { useState, useEffect } from "react";
import RiskRegisterModal from "./RiskRegisterModal";
import RiskModal from "./RiskModal";
import { bridgeEscalateGovernanceEvent } from "../governance/governanceBridge";

export default function RiskWorkspaceProvider(props) {

  const [riskModalOpen, setRiskModalOpen] = useState(false);
  const [activeRiskEventId, setActiveRiskEventId] = useState(null);

  function openRiskEvent(eventId) {
    setActiveRiskEventId(eventId);
    setRiskModalOpen(true);
  }

    useEffect(() => {
      if (!props.constitutionalEngagement?.governanceEventId) return;

      openRiskEvent(
        props.constitutionalEngagement.governanceEventId
      );
    }, [props.constitutionalEngagement]);


  function handleEscalateRisk(eventId) {
    bridgeEscalateGovernanceEvent({
      eventId
    });
  }

  const constitutionalReadOnly =
    props.constitutionalEngagement?.responsibility === "RISK_INSPECTION";

  return (
    <>
      <RiskRegisterModal
        taskId={props.task?.id}
        taskTitle={props.task?.title}
        segmentId={props.segment?.segmentId || props.segment?.id}
        isPM={props.isPM}
        readOnly={props.readOnly || constitutionalReadOnly}
        onClose={props.onClose}
        constitutionalEngagement={props.constitutionalEngagement}
        openRiskEvent={openRiskEvent}
      />

      {riskModalOpen && activeRiskEventId && (
        <RiskModal
          taskId={props.task?.id}
          taskTitle={props.task?.title}
          eventId={activeRiskEventId}
          isPM={props.isPM}
          readOnly={props.readOnly || constitutionalReadOnly}
          onClose={() => setRiskModalOpen(false)}
          onAddNote={props.onAddNote}
          onEscalate={props.onEscalateRisk}
        />
      )}
    </>
  );
}
