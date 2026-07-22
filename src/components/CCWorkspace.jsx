// @ts-nocheck

/*
======================================================================

METRA — CCWorkspace.jsx
Stage 500T — Constitutional CC Workspace Foundation

PURPOSE
-------

Constitutional destination for CC lifecycle.

Initially delegates to the existing CC capability.

No constitutional behaviour changes occur in this stage.

======================================================================
*/

import CCRegisterModal from "./CCRegisterModal";

export default function CCWorkspace(props) {

  const constitutionalReadOnly =
    props.constitutionalEngagement?.responsibility === "CC_INSPECTION";
  return (
    <CCRegisterModal
      taskId={props.task?.id}
      taskTitle={props.task?.title}
      segmentId={props.segment?.segmentId || props.segment?.id}
      isPM={props.isPM}
      readOnly={props.readOnly || constitutionalReadOnly}
      onClose={props.onClose}
        constitutionalEngagement={props.constitutionalEngagement}
      openCCEvent={props.openCCEvent}
    />
  );
}
