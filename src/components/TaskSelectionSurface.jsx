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
import { getActingUser } from "../domain/actor/ActingUser";

import {
  resolveConstitutionalWorkspace,
  CONSTITUTIONAL_WORKSPACE
} from "../domain/constitutional/ConstitutionalWorkspaceRouter";

export default function TaskSelectionSurface(props) {
  const actor = getActingUser();

  const workspace =
    resolveConstitutionalWorkspace({
      constitutionalEngagement: props.constitutionalEngagement,
      actor,
      segment: props.segment,
      task: props.task
    });

  const isOperationalWorkspace =
    workspace.destination ===
    CONSTITUTIONAL_WORKSPACE.OPERATIONAL;

  const isAdvisoryWorkspace =
    workspace.destination ===
    CONSTITUTIONAL_WORKSPACE.ADVISORY;

  if (isOperationalWorkspace) {
    return <TaskPopup {...props} />;
  }

  if (isAdvisoryWorkspace) {
    return <AdvisoryWorkspace {...props} />;
  }

  return null;
}
