/*
=====================================================================
METRA — Personnel Identity Seed (Canonical)
Stage 257 Addendum — Read-only Personnel Data Source
---------------------------------------------------------------------
Purpose:
• Provide minimal Personnel identities for selection
• Identity-level only (no roles, authority, or lifecycle)
• Read-only consumption by UI surfaces

This file is NOT:
• Personnel creation
• Personnel management
• Governance logic
=====================================================================
*/

export const personnel = [
  { id: "p-001", displayName: "Alice Brown" },
  { id: "p-002", displayName: "Brian Chen" },
  { id: "p-003", displayName: "Carla Singh" },
];

/*
Notes:
• Fields intentionally minimal
• No implied roles or authority
• Suitable for assignment / reassignment testing
*/
