// @ts-nocheck

/*
======================================================================

METRA — IssueWorkspaceProvider.jsx
Stage 500V — Constitutional Issue Workspace Provider

PURPOSE
-------
Constitutional owner of the Issue Workspace lifecycle.

The provider owns Issue workspace entry and event opening.

The Issue capability remains the underlying governance surface.

======================================================================
*/

import { useState } from "react";
import IssueRegisterModal from "./IssueRegisterModal";
import IssueModal from "./IssueModal";

export default function IssueWorkspaceProvider(props) {

  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [activeIssueEventId, setActiveIssueEventId] = useState(null);

  function openIssueEvent(eventId) {
    setActiveIssueEventId(eventId);
    setIssueModalOpen(true);
  }


  const constitutionalReadOnly =
    props.constitutionalEngagement?.responsibility === "ISSUE_INSPECTION";

  return (
    <>
      <IssueRegisterModal
        taskId={props.task?.id}
        taskTitle={props.task?.title}
        segmentId={props.segment?.segmentId || props.segment?.id}
        isPM={props.isPM}
        readOnly={props.readOnly || constitutionalReadOnly}
        onClose={props.onClose}
        constitutionalEngagement={props.constitutionalEngagement}
          openIssueEvent={openIssueEvent}
      />

      {issueModalOpen && activeIssueEventId && (
        <IssueModal
          taskId={props.task?.id}
          taskTitle={props.task?.title}
          eventId={activeIssueEventId}
          isPM={props.isPM}
          readOnly={props.readOnly || constitutionalReadOnly}
          onClose={() => setIssueModalOpen(false)}
          onAddNote={props.onAddNote}
          onEscalate={props.onEscalateIssue}
        />
      )}
    </>
  );
}
