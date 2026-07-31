// @ts-nocheck

/*
======================================================================

METRA — ConstitutionalOperationalEntryResolver.js

PURPOSE
-------
Resolve the operational register destination for a
Constitutional Responsibility.

CONSTITUTIONAL RULES
--------------------
• Responsibility belongs to a segment.
• Responsibility does not belong to a task.
• Resolver derives destination only.
• Resolver performs no mutation.
• Resolver performs no rendering.
• Resolver has no UI knowledge.

======================================================================
*/

export function resolveConstitutionalOperationalEntry(
  responsibility
) {
  switch (responsibility) {
    case "RISK_INSPECTION":
      return "risks";

    case "ISSUE_INSPECTION":
      return "issues";

    case "QC_INSPECTION":
      return "qc";

    case "CC_INSPECTION":
      return "change";

    case "ESCALATION_INSPECTION":
      return "escalation";

    default:
      return null;
  }
}

export default resolveConstitutionalOperationalEntry;
