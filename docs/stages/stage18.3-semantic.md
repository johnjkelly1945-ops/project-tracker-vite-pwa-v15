=====================================================================
METRA — STAGE 18.3 SEMANTIC RECORD
Task Activation & Assignment
=====================================================================

STAGE TYPE
---------------------------------------------------------------------
Semantic / Contract Definition Stage
(UI binding intentionally deferred)

STAGE CONTEXT
---------------------------------------------------------------------
• Workspace UI and TaskPopup rendering intentionally disabled
• Personnel popup active (verified)
• Stage focus is behavioural semantics, not visual confirmation
• No browser-visible changes expected or required

OBJECTIVE
---------------------------------------------------------------------
Define and lock task assignment and activation semantics
without re-enabling workspace or popup UI.

SEMANTIC DECISIONS
---------------------------------------------------------------------

1. ASSIGNMENT PRINCIPLE
• Assignment is to a PERSON only
• Assignment is explicit and intentional
• No default or inferred assignment

2. ACTIVATION RULE (LOCKED)
• Assignment IS the sole activation trigger
• Immediate activation on assignment
• No intermediate “assigned but inactive” state

3. REASSIGNMENT RULE
• Reassignment is permitted
• Initiated by PM authority (assumed)
• Each assignment/reassignment is:
  – Explicit
  – Date-stamped
  – Auditable
• Task remains active throughout reassignment
• No history overwritten

4. AUTHORITY MODEL (ASSUMED)
• PM authority assumed for Stage 18.3
• Capability-based enforcement deferred

5. NOTES & AUDIT PRESENTATION
• Notes remain append-only
• Notes display:
  – Author initials
  – Timestamp
• Initials derived at note creation
• No Personnel schema change

6. ACTIVATION INVARIANT
• active ⇔ assignedTo exists
• All write paths must respect this invariant

EXPLICIT NON-GOALS
---------------------------------------------------------------------
• No workspace or popup re-enablement
• No UI verification
• No schema migration
• No governance expansion

STAGE STATUS
---------------------------------------------------------------------
Stage 18.3 — SEMANTICALLY COMPLETE

END OF RECORD
=====================================================================
