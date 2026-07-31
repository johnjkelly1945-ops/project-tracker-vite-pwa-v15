# METRA — ARCHITECTURE SEM

## Constitutional Routing SEM

**STATUS**

ARCHITECTURE REFERENCE


## PURPOSE

This SEM defines how METRA determines the constitutional destination
for a responsibility.

The router translates responsibility into location.

It does not execute the responsibility.


## PROBLEM ADDRESSED

Without constitutional routing, responsibility decisions become
embedded in user interfaces.

This creates:

- duplicated routing logic
- hidden ownership decisions
- inconsistent behaviour
- increased coupling


## ARCHITECTURAL PRINCIPLE

Routing responsibility is separate from performing responsibility.


## ROUTING MODEL

Responsibility

↓

Constitutional Operational Entry

↓

Constitutional Workspace Router

↓

Workspace Destination


## RESPONSIBILITY OF THE ROUTER

The router owns:

- destination selection
- constitutional interpretation
- workspace resolution


The router does not own:

- lifecycle state
- capability behaviour
- operational decisions


## EXAMPLE

A person holding:

QC_INSPECTION responsibility


does not directly open the QC capability.

The flow is:

QC_INSPECTION

↓

ConstitutionalWorkspaceRouter

↓

QCWorkspace

↓

QCWorkspaceProvider

↓

QC capability


## MIGRATION RULE

Do not place constitutional routing decisions inside:

- Task surfaces
- Modal components
- Capability components


Routing belongs at the constitutional boundary.


## VALIDATION

A routing implementation is correct when:

- Responsibility produces one clear destination.
- The destination is independent of UI structure.
- The capability remains reusable.
- New entry surfaces do not require new routing logic.


## STAGE 500 PROOF

Validated through:

- Governance
- Risk
- CC
- Issue
- QC


## CANONICAL RULE

The router decides where responsibility belongs.

It does not perform the responsibility.
