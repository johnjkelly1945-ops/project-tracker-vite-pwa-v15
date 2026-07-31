/*
======================================================================

METRA — QCWorkspaceProvider.jsx
Stage 500V — Constitutional QC Workspace Provider

PURPOSE
-------
Constitutional owner of the QC Workspace lifecycle.

The provider owns QC workspace entry and event opening.

The QC capability remains the underlying governance surface.

======================================================================
*/

import { useState } from "react";
import QCRegisterModal from "./QCRegisterModal";
import QCModal from "./QCModal";

export default function QCWorkspaceProvider(props) {

  const [qcModalOpen, setQcModalOpen] = useState(false);
  const [activeQCEventId, setActiveQCEventId] = useState(null);

  function openQCEvent(eventId) {
    setActiveQCEventId(eventId);
    setQcModalOpen(true);
  }

  const constitutionalReadOnly =
    props.constitutionalEngagement?.responsibility === "QC_INSPECTION";

  return (
    <>
      <QCRegisterModal
        taskId={props.task?.id}
        taskTitle={props.task?.title}
        segmentId={props.segment?.segmentId || props.segment?.id}
        isPM={props.isPM}
        readOnly={props.readOnly || constitutionalReadOnly}
        onClose={props.onClose}
        constitutionalEngagement={props.constitutionalEngagement}
        openQCEvent={openQCEvent}
      />

      {qcModalOpen && activeQCEventId && (
        <QCModal
          taskId={props.task?.id}
          taskTitle={props.task?.title}
          eventId={activeQCEventId}
          isPM={props.isPM}
          readOnly={props.readOnly || constitutionalReadOnly}
          onClose={() => setQcModalOpen(false)}
          onAddNote={props.onAddNote}
          onEscalate={props.onEscalateQC}
        />
      )}
    </>
  );
}
