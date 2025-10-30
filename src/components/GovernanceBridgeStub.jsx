/* ======================================================================
   METRA – GovernanceBridgeStub.jsx
   Phase 3.5 – Non-Visual Linkage Prototype
   ----------------------------------------------------------------------
   • Provides background registration between Task auditRef,
     Template reference, and Governance identifiers.
   • No UI output.
   ====================================================================== */

import { registerLinkedEntity } from "../utils/auditHandler";

export default function GovernanceBridgeStub({ auditRef, templateRef, governanceLink }) {
  if (!auditRef) return null;

  registerLinkedEntity(auditRef, {
    templateRef: templateRef || null,
    governanceLink: governanceLink || null,
  });

  return null; // Silent background component
}

