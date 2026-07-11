// @ts-nocheck
/*
======================================================================

METRA — ConstitutionalScopeResolver.js
Stage 500L-2B — Constitutional Scope Population

PURPOSE
-------

Reveal the complete constitutional scope of an actor.

Stage 500L establishes the constitutional owner of the
actor's constitutional world.

Initially this resolver establishes the constitutional
destination only.

Subsequent bounded migrations will progressively introduce:

• Current Constitutional Scope
• Constitutional Changes Since Previous Visit

CONSTITUTIONAL RULES
--------------------

• Repository remains the single source of truth.
• Resolver performs aggregation only.
• Resolver performs no mutation.
• Resolver performs no rendering.
• Resolver performs no authority determination.
• Resolver performs no visibility determination.

No behavioural changes occur in this stage.

======================================================================
*/
import {
  resolveConstitutionalEngagements
} from "./ConstitutionalEngagementResolver";


export function resolveConstitutionalScope(actor) {
  return {
    actor,
    currentConstitutionalScope:
      resolveConstitutionalEngagements(actor)
  };
}

export default resolveConstitutionalScope;
