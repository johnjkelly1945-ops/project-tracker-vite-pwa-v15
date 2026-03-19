/*
=====================================================================
METRA — PersonnelRegistry (Stage 402)
=====================================================================

STAGE
---------------------------------------------------------------------
Stage 402 — Personnel Registry (Read-Only + Runtime Overlay)

PURPOSE
---------------------------------------------------------------------
Provide a read-only personnel data source with temporary runtime
overlay to preserve UI behaviour.

AUTHORITATIVE RULES
---------------------------------------------------------------------
• Seed data is read-only
• Runtime additions are in-memory only
• No persistence
• No authority logic
• No lifecycle interaction
• No UI ownership

This module is a passive identity provider with a temporary
runtime overlay for behavioural continuity.

=====================================================================
*/

import { personnel as seedPersonnel } from "../../data/personnel";

/**
 * Runtime overlay (in-memory only)
 */
let runtimePersonnel = [];

/**
 * Read-only access for consumers
 */
export function getPersonnel() {
  return [...seedPersonnel, ...runtimePersonnel];
}

/**
 * Runtime mutation (non-persistent)
 * Preserves existing behaviour without introducing authority
 */
export function setPersonnel(next) {
  if (!Array.isArray(next)) return;

  runtimePersonnel = [...next];
}

