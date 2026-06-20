// @ts-nocheck

/*
======================================================================

METRA — PersonnelObservationTypes.js
Stage 500D Phase 2B-A

PURPOSE
-------
Provide canonical Observation type identifiers.

CONSTITUTIONAL RULES
--------------------
• Observation is segment-local
• Observation grants visibility
• Observation does NOT grant Participation
• Observation does NOT grant Inspection
• Observation does NOT create Experience
• Observation does NOT create Skills

======================================================================
*/

export const OBSERVATION_TYPES = Object.freeze({
  DASHBOARD: "DASHBOARD",
  DOCUMENTS: "DOCUMENTS",
  PERSONNEL: "PERSONNEL",

  RISK_INSPECTION: "RISK_INSPECTION",
  ISSUE_INSPECTION: "ISSUE_INSPECTION",
  QC_INSPECTION: "QC_INSPECTION",
  CC_INSPECTION: "CC_INSPECTION",
  ESCALATION_INSPECTION: "ESCALATION_INSPECTION"
});

export default OBSERVATION_TYPES;
