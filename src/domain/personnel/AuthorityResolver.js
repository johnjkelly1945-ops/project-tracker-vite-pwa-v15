// =====================================================================
// METRA — AuthorityResolver
// Stage 407 — Personnel Edit Authority
// Stage 408 — Segment Admin Authority (Controlled Context Introduction)
// =====================================================================

export function canEditPersonnel(person) {
  if (!person) return false;

  const role = person.role;

  if (role === "PM") return true;

  if (role === "Admin" && person.isSegmentAdmin === true) return true;

  return false;
}
