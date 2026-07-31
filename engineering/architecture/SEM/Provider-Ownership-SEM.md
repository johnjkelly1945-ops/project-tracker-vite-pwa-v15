# METRA — ARCHITECTURE SEM

## Provider Ownership SEM

**STATUS**

ARCHITECTURE REFERENCE


## PURPOSE

This SEM defines the role of a Workspace Provider.

The provider is the lifecycle owner inside a constitutional workspace.


## PROBLEM ADDRESSED

Without explicit ownership, lifecycle behaviour can become distributed
across:

- parent components
- task surfaces
- modal containers
- capability components


This creates unclear responsibility.


## ARCHITECTURAL PRINCIPLE

The provider owns the lifecycle.

The capability performs the operation.


## PROVIDER RESPONSIBILITY

A Workspace Provider owns:

- workspace state
- lifecycle entry
- event opening
- context propagation


A Workspace Provider does not own:

- constitutional routing
- responsibility assignment
- unrelated capability behaviour


## OWNERSHIP MODEL

Constitutional Router

↓

Workspace

↓

Provider

(lifecycle owner)

↓

Capability


## MIGRATION RULE

When migrating a capability:

Move lifecycle ownership first.

Do not simply move rendering.


## VALIDATION

A provider migration is complete when:

- Lifecycle state is no longer held by the old owner.
- Events open through the provider.
- The capability remains reusable.
- Context flows correctly.


## STAGE 500 PROOF

Validated through:

- RiskWorkspaceProvider
- CCWorkspaceProvider
- IssueWorkspaceProvider
- QCWorkspaceProvider


## CANONICAL RULE

The provider owns the journey.

The capability performs the work.
