// @ts-nocheck
/*
======================================================================

METRA — CCWorkspaceProvider.jsx
Stage 500V — CC Constitutional Workspace Provider

PURPOSE
-------
Constitutional owner of the CC Workspace lifecycle.

The provider owns CC workspace entry and event opening.

The CC capability remains the underlying governance surface.

======================================================================
*/

import { useState } from "react";
import CCRegisterModal from "./CCRegisterModal";
import CCModal from "./CCModal";

export default function CCWorkspaceProvider(props) {

  const [ccModalOpen, setCcModalOpen] = useState(false);
  const [activeCcEventId, setActiveCcEventId] = useState(null);

  function openCCEvent(eventId) {
    setActiveCcEventId(eventId);
    setCcModalOpen(true);
  }

  const constitutionalReadOnly =
    props.constitutionalEngagement?.responsibility === "CC_INSPECTION";

  return (
    <>
      <CCRegisterModal
        taskId={props.task?.id}
        taskTitle={props.task?.title}
        segmentId={props.segment?.segmentId || props.segment?.id}
        isPM={props.isPM}
        readOnly={props.readOnly || constitutionalReadOnly}
        onClose={props.onClose}
        constitutionalEngagement={props.constitutionalEngagement}
        onOpenCCEvent={openCCEvent}
      />

      {ccModalOpen && activeCcEventId && (
        <CCModal
          taskId={props.task?.id}
          taskTitle={props.task?.title}
          eventId={activeCcEventId}
          isPM={props.isPM}
          readOnly={props.readOnly || constitutionalReadOnly}
          onClose={() => setCcModalOpen(false)}
          onAddNote={props.onAddNote}
        />
      )}
    </>
  );
}
