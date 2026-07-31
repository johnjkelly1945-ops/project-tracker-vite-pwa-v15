# METRA — ARCHITECTURE SEM

## Constitutional Migration Method SEM

**STATUS**

ARCHITECTURE REFERENCE


## PURPOSE

This SEM defines the approved method for changing ownership boundaries
without changing proven capability behaviour.

The purpose is to preserve architectural integrity during migration.


## PROBLEM ADDRESSED

Architectural migrations can fail when implementation changes begin
before ownership is understood.

This creates:

- duplicated logic
- broken lifecycle paths
- unclear responsibility
- accidental redesign


## ARCHITECTURAL PRINCIPLE

Move ownership before moving implementation.


## MIGRATION SEQUENCE


### 1. Identify the Constitutional Contract

Define:

- responsibility being exercised
- expected destination
- expected owner


Question:

"Who should own this interaction?"


### 2. Identify Current and Future Owners

Determine:

Current owner

↓

Future owner


The migration begins with ownership, not files.


### 3. Inspect the Hand-Off

Inspect only the seam between owners.

Ask:

"Has the constitutional contract been honoured?"


If the contract has been honoured:

Continue.

If not:

Locate the first failed hand-off.


### 4. Preserve the Capability

The migration must not:

- recreate working capability
- redesign operational behaviour
- duplicate domain logic


The capability remains the capability.


### 5. Create the New Owner

Introduce:

- workspace boundary
- provider ownership
- constitutional routing


### 6. Remove Previous Ownership

The previous surface releases:

- lifecycle state
- routing decisions
- domain coordination


It may continue to:

- reveal options
- pass context
- preserve continuity


### 7. Verify Completion

A migration requires three proofs:


## Behavioural Proof

The user reaches the correct destination.


## Ownership Proof

The new owner controls lifecycle.


## Repository Proof

The ownership boundary exists in version history.


Only when all three succeed is migration complete.


## STAGE 500 EXEMPLAR

Risk established the migration pattern.

Issue demonstrated clean reuse.

QC completed the governance migration family.


## FORBIDDEN PATTERNS

Do not:

- migrate UI without ownership
- create replacement capabilities unnecessarily
- bypass constitutional routing
- declare completion without repository evidence


## CANONICAL RULE

Inspect the hand-off.

Transfer ownership.

Preserve capability.

Verify before baseline.
