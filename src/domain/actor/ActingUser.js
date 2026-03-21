// @ts-nocheck
/*
=====================================================================
METRA — ActingUser.js
Stage 413 — Actor Injection & System Identity Layer
=====================================================================

Purpose
---------------------------------------------------------------------
Provide a canonical, explicit acting user for authority evaluation.

Rules
---------------------------------------------------------------------
• No implicit actor
• No fallback actor
• No UI dependency
• Actor must be explicitly set
• If no actor → authority MUST deny

=====================================================================
*/

let currentActor = null;

/*
=====================================================================
SET ACTING USER
=====================================================================
*/

export function setActingUser(user) {
  currentActor = user || null;
}

/*
=====================================================================
GET ACTING USER
=====================================================================
*/

export function getActingUser() {
  return currentActor;
}

/*
=====================================================================
CLEAR ACTING USER (OPTIONAL)
=====================================================================
*/

export function clearActingUser() {
  currentActor = null;
}
