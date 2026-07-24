// @ts-nocheck
/*
======================================================================

METRA — MyWorldResponsibilityProjectionResolver.js

PURPOSE
-------

Aggregate all current METRA responsibilities for My World.

Includes:
- Constitutional responsibilities
- Operational responsibilities
- Advisory responsibilities

This is broader than Constitutional Appointment Projection.

======================================================================
*/

import resolveConstitutionalAppointmentProjection
  from "./ConstitutionalAppointmentProjectionResolver";

import { resolveAssigneeResponsibilities }
  from "./AssigneeResponsibilityResolver";

import { resolveAdvisoryResponsibilities }
  from "./AdvisoryResponsibilityResolver";


export function resolveMyWorldResponsibilityProjection(
  person,
  segments = [],
  tasks = []
) {

  return [
    ...resolveConstitutionalAppointmentProjection(
      person,
      segments,
      tasks
    ),

    ...resolveAssigneeResponsibilities(
      person,
      tasks,
      segments
    ),

    ...resolveAdvisoryResponsibilities(
      person,
      tasks,
      segments
    )
  ];

}

export default
resolveMyWorldResponsibilityProjection;
