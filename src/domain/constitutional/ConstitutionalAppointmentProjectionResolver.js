// @ts-nocheck
/*
======================================================================

METRA — ConstitutionalAppointmentProjectionResolver.js
Stage 500L-3B — Constitutional Appointment Projection Foundation

PURPOSE
-------

Project constitutional appointment records into
presentation-ready appointment projections.

Initially this resolver establishes the constitutional
destination only.

Subsequent bounded migrations will progressively introduce:

• Segment projection
• Appointment projection
• Presentation projection

CONSTITUTIONAL RULES
--------------------

• Repository remains the single source of truth.
• Resolver performs projection only.
• Resolver performs no mutation.
• Resolver performs no routing.
• Resolver performs no rendering.
• Resolver performs no authority determination.

No behavioural changes occur in this stage.

======================================================================
*/

export function resolveConstitutionalAppointmentProjection(
  appointment
) {
  if (!appointment) {
    return null;
  }

  return appointment;
}

export default
resolveConstitutionalAppointmentProjection;
