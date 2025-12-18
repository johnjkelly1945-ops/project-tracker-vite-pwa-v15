/* ======================================================================
   METRA – PopupOverlayWrapper.jsx
   Stage 11.2a – Delegates to restored TaskPopup
   ----------------------------------------------------------------------
   ✔ Replaces disabled stub
   ✔ Central popup entry point preserved
   ✔ No behaviour added
   ====================================================================== */

import React from "react";
import TaskPopup from "./TaskPopup";

export default function PopupOverlayWrapper(props) {
  return <TaskPopup {...props} />;
}
