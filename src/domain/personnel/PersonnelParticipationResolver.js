// @ts-nocheck

export function resolvePersonnelParticipation(person) {
  if (!person) return [];

  const records = [];

  if (person.isAdmin) {
    records.push({
      role: "Admin",
      startedOn: "Current",
      status: "Active"
    });
  }

  return records;
}
