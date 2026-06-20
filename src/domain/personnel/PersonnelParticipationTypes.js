// @ts-nocheck

/*
======================================================================

METRA — PersonnelParticipationTypes.js
Stage 500D Phase 2B-A

PURPOSE
-------
Provide canonical Participation type identifiers.

CONSTITUTIONAL RULES
--------------------
• Participation is segment-local
• Participation is assigned
• Participation is historical
• Participation contributes to Experience
• Participation does NOT represent Context
• Participation does NOT represent Observation

======================================================================
*/

export const PARTICIPATION_TYPES = Object.freeze({
  ADMIN: "ADMIN",

  RISK_INSPECTION: "RISK_INSPECTION",
  ISSUE_INSPECTION: "ISSUE_INSPECTION",
  QC_INSPECTION: "QC_INSPECTION",
  CC_INSPECTION: "CC_INSPECTION",
  ESCALATION_INSPECTION: "ESCALATION_INSPECTION"
});

export default PARTICIPATION_TYPES;
