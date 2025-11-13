/* ======================================================================
   METRA – PersonnelBridge.js
   Phase 4.6B.13 Step 6E – Enhanced Personnel Metadata
   ----------------------------------------------------------------------
   Provides enriched personnel model for internal and external personnel.
   Only "active: true" personnel appear in the selection overlay.
   ====================================================================== */

export const PersonnelBridge = {
  getPersonnel: () => [
    {
      id: "PER-001",
      name: "Alice Morgan",
      role: "Project Manager",
      organisation: "Internal",
      department: "PMO",
      telephone: "0207 123 4567",
      email: "alice.morgan@internal.example",
      active: true,
    },
    {
      id: "PER-002",
      name: "David Chen",
      role: "Analyst",
      organisation: "Internal",
      department: "Analysis",
      telephone: "0207 987 6543",
      email: "david.chen@internal.example",
      active: true,
    },
    {
      id: "PER-003",
      name: "Priya Patel",
      role: "Consultant",
      organisation: "Arup Consulting",   // external organisation
      department: "Delivery",
      telephone: "0207 555 9876",
      email: "priya.patel@arup.com",
      active: true,
    },
    {
      id: "PER-004",
      name: "Michael Roberts",
      role: "Senior Advisor",
      organisation: "KPMG",
      department: "Advisory",
      telephone: "0207 333 4444",
      email: "michael.roberts@kpmg.com",
      active: false,  // inactive → hidden from overlay
    },
  ],
};
