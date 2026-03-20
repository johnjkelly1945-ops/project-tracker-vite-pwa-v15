// =====================================================================
// METRA — AuthorityResolver
// Stage 407 — Personnel Edit Authority
// =====================================================================

export function canEditPersonnel(person) {
  if (!person) return false;

  const role = person.role;

  return role === "PM" || role === "Admin";
}
