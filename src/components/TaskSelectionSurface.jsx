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
import AdvisoryWorkspace from "./AdvisoryWorkspace";
import GovernanceWorkspace from "./GovernanceWorkspace";
import CCWorkspace from "./CCWorkspace";
import RiskWorkspace from "./RiskWorkspace";
import IssueWorkspace from "./IssueWorkspace";
import QCWorkspace from "./QCWorkspace";
import { getActingUser } from "../domain/actor/ActingUser";

import {
  resolveConstitutionalWorkspace,
  CONSTITUTIONAL_WORKSPACE
} from "../domain/constitutional/ConstitutionalWorkspaceRouter";

export default function TaskSelectionSurface(props) {
  console.log("STAGE500T TASK SELECTION");

  const actor = getActingUser();

    console.log("STAGE500T TASK SURFACE PROPS", {
      segment: props.segment,
      task: props.task,
      constitutionalEngagement: props.constitutionalEngagement
    });

  const workspace =
    resolveConstitutionalWorkspace({
      constitutionalEngagement: props.constitutionalEngagement,
      actor,
      segment: props.segment,
      task: props.task
    });

    console.log("STAGE500W FINAL ROUTE", {
      engagement: props.constitutionalEngagement,
      destination: workspace.destination,
      task: props.task?.id
    });

  const isTaskWorkspace =
    workspace.destination ===
    CONSTITUTIONAL_WORKSPACE.TASK;

  const isAdvisoryWorkspace =
    workspace.destination ===
    CONSTITUTIONAL_WORKSPACE.ADVISORY;

  const isGovernanceWorkspace =
    workspace.destination ===
    CONSTITUTIONAL_WORKSPACE.GOVERNANCE;

    const isCCWorkspace =
      workspace.destination ===
      CONSTITUTIONAL_WORKSPACE.CC;

    const isRiskWorkspace =
      workspace.destination ===
      CONSTITUTIONAL_WORKSPACE.RISK;
    const isIssueWorkspace =
      workspace.destination ===
      CONSTITUTIONAL_WORKSPACE.ISSUE;

      const isQCWorkspace =
        workspace.destination ===
        CONSTITUTIONAL_WORKSPACE.QC;

  if (isTaskWorkspace) {
    return <TaskPopup {...props} />;
  }

  if (isAdvisoryWorkspace) {
      console.log("STAGE500W ADVISORY BRANCH HIT");
    return <AdvisoryWorkspace {...props} />;
  }

  if (isGovernanceWorkspace) {
    return <GovernanceWorkspace {...props} />;
  }


  if (isCCWorkspace) {
    return <CCWorkspace {...props} />;
  }

  if (isRiskWorkspace) {
    return <RiskWorkspace {...props} />;
  }
    if (isIssueWorkspace) {
      return <IssueWorkspace {...props} />;
    }

    if (isQCWorkspace) {
      return <QCWorkspace {...props} />;
    }


  return null;
}
