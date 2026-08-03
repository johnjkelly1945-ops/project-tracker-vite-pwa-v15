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

Governance lifecycle ownership is now contained within this provider.

No constitutional behaviour changes occur in this stage.

======================================================================
*/

import { useState, useEffect } from "react";
import RiskWorkspace from "./RiskWorkspace";
import IssueWorkspace from "./IssueWorkspace";
import QCWorkspace from "./QCWorkspace";
import CCWorkspace from "./CCWorkspace";
import { getActingUser } from "../domain/actor/ActingUser";
import { resolveOperationalAuthority } from "../domain/operation/OperationalAuthorityResolver";

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
  const [riskModalOpen, setRiskModalOpen] = useState(false);
  const [riskRegisterOpen, setRiskRegisterOpen] = useState(false);
  const [activeRiskEventId, setActiveRiskEventId] = useState(null);

  /* ================= Stage 333 — Issue State ================= */
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issueRegisterOpen, setIssueRegisterOpen] = useState(false);
  const [activeIssueEventId, setActiveIssueEventId] = useState(null);
  /* ================= End Stage 333 State ================= */

  /* ================= Stage 334 — QC State ================= */
  const [qcModalOpen, setQcModalOpen] = useState(false);
  const [qcRegisterOpen, setQcRegisterOpen] = useState(false);
  const [ccRegisterOpen, setCcRegisterOpen] = useState(false);
  const [activeQcEventId, setActiveQcEventId] = useState(null);
  /* ================= End Stage 334 State ================= */

  /* ================= Stage 335 — CC State ================= */
  const [ccModalOpen, setCcModalOpen] = useState(false);
  const [escalationRegisterOpen, setEscalationRegisterOpen] = useState(false);
  const [activeCcEventId, setActiveCcEventId] = useState(null);

  function openGovernanceSurface(eventType, eventId) {
    switch (eventType) {
      case "RISK":
        setActiveRiskEventId(eventId);
        setRiskModalOpen(true);
        break;

      case "ISSUE":
        setActiveIssueEventId(eventId);
        setIssueModalOpen(true);
        break;

      case "QC":
        setActiveQcEventId(eventId);
        setQcModalOpen(true);
        break;

      case "CC":
        setActiveCcEventId(eventId);
        setCcModalOpen(true);
        break;

      default:
        return;

    }
  }



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

    const advisoryTypes = resolvedAdvisoryEngagement
      ? [resolvedAdvisoryEngagement.eventType]
      : [];


    const actor = getActingUser();

    const {
      isAdvisor
    } = resolveOperationalAuthority({
      engagement: props.constitutionalEngagement,
      actor,
      segment: props.segment,
      task: props.task
    });

  console.log("STAGE500W PROVIDER", {
    taskId: props.task?.id,
    resolvedAdvisoryEngagement,
    advisoryTypes
  });

    console.log("STAGE500W CONTRACT IN PROVIDER", props.constitutionalEngagement);

    function handleAdvisorySelection() {
      if (!resolvedAdvisoryEngagement) return;

      openGovernanceSurface(
        resolvedAdvisoryEngagement.eventType,
        resolvedAdvisoryEngagement.eventId
      );
    }



  const advisoryContext = {
    ...props,
  };



    console.log("STAGE500W PROVIDER RENDER", { isAdvisor, advisoryTypes });


  return (
  <>


      {isAdvisor && resolvedAdvisoryEngagement && (
        <>
          <span>Advisory</span>
          {" - "}
          <span
            style={{ cursor: "pointer" }}
            onClick={() => handleAdvisorySelection()}
          >
            {resolvedAdvisoryEngagement.eventType}
          </span>
        </>
      )}
    {riskRegisterOpen && (
      <RiskWorkspace
        task={props.task}
        segment={props.segment}
        isPM={props.isPM}
        readOnly={props.readOnly}
        onClose={() => setRiskRegisterOpen(false)}
        constitutionalEngagement={props.constitutionalEngagement}
      />
    )}

    {issueRegisterOpen && (
      <IssueWorkspace
        task={props.task}
        segment={props.segment}
        isPM={props.isPM}
        readOnly={props.readOnly}
        onClose={() => setIssueRegisterOpen(false)}
        constitutionalEngagement={props.constitutionalEngagement}
      />
    )}

    {qcRegisterOpen && (
      <QCWorkspace
        task={props.task}
        segment={props.segment}
        isPM={props.isPM}
        readOnly={props.readOnly}
        onClose={() => setQcRegisterOpen(false)}
        constitutionalEngagement={props.constitutionalEngagement}
      />
    )}

    {ccRegisterOpen && (
      <CCWorkspace
        task={props.task}
        segment={props.segment}
        isPM={props.isPM}
        readOnly={props.readOnly}
        onClose={() => setCcRegisterOpen(false)}
        constitutionalEngagement={props.constitutionalEngagement}
        openCCEvent={(id) => {
          openGovernanceSurface("CC", id);
        }}
      />
    )}

    </>
  );
}
