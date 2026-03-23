// @ts-nocheck
/*
=====================================================================
METRA — PermissionMatrix.js
Stage 419 — Authority Implementation (Surface-Aware)
=====================================================================
*/

export const PERMISSION_MATRIX = {
  PM: {
    "*": true
  },

  ADMIN: {
    "*": true
  },

  ASSIGNEE: {
    ADD_TASK_NOTE: true,
    EDIT_TASK: true
  },

  ADVISOR: {
    ADD_ADVISORY_NOTE: true,
    VIEW_GOVERNANCE: true
  }
};

export function isActionAllowed(role, action) {
  const rolePermissions = PERMISSION_MATRIX[role];

  if (!rolePermissions) return false;
  if (rolePermissions["*"]) return true;

  return !!rolePermissions[action];
}
