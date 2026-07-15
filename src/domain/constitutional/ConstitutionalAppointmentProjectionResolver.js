// @ts-nocheck
/*
======================================================================

METRA — ConstitutionalAppointmentProjectionResolver.js
Stage 500L-9B — Responsibility Contributor Aggregation

PURPOSE
-------

Constitutional entry point for actor responsibility projection.

Contributors remain constitutionally sovereign.

This resolver aggregates their projections.

======================================================================
*/

import { resolvePersonnelParticipation }
  from "../personnel/PersonnelParticipationResolver";

import { resolvePmResponsibilities }
  from "./PmResponsibilityResolver";

import { resolveAssigneeResponsibilities }
  from "./AssigneeResponsibilityResolver";

export function resolveConstitutionalAppointmentProjection(
  person,
  segments = [],
  tasks = []
) {

  return [

    ...resolvePmResponsibilities(
      person,
      segments
    ),

    ...resolvePersonnelParticipation(
        person,
        segments
      ),

      ...resolveAssigneeResponsibilities(
        person,
        tasks,
        segments
      )

  ];

}

export default
resolveConstitutionalAppointmentProjection;
