// @ts-nocheck
/*
======================================================================

METRA — ConstitutionalAppointmentProjectionResolver.js
Stage 500L-7A — Constitutional Appointment Projection Promotion

PURPOSE
-------

Constitutional entry point for actor appointment projection.

This stage promotes the existing Personnel Participation
Resolver behind the constitutional interface.

No new projection logic is introduced.

CONSTITUTIONAL RULES
--------------------

• Repository remains the single source of truth.
• Projection is delegated to the Personnel Participation Resolver.
• Resolver performs no mutation.
• Resolver performs no routing.
• Resolver performs no rendering.
• Resolver performs no authority determination.

======================================================================
*/

import { resolvePersonnelParticipation }
  from "../personnel/PersonnelParticipationResolver";

export function resolveConstitutionalAppointmentProjection(
  person,
  segments = []
) {
  return resolvePersonnelParticipation(
    person,
    segments
  );
}

export default
resolveConstitutionalAppointmentProjection;
