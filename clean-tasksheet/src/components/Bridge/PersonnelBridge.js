/* ======================================================================
   METRA – PersonnelBridge.js
   Phase 4.6B.13 Step 6H – Persistent Personnel Store (localStorage)
   ----------------------------------------------------------------------
   Provides:
   - getPersonnel()  → loads from memory (initially from localStorage)
   - updatePerson()  → updates memory + saves to localStorage
   - Full METRA key: "metra_personnel_store_v1"
   ====================================================================== */

const STORAGE_KEY = "metra_personnel_store_v1";

/* ======================================================================
   1. DEFAULT PERSONNEL (only used if nothing exists in storage)
   ====================================================================== */
const defaultPersonnel = [
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
    organisation: "Arup Consulting",
    department: "Delivery",
    telephone: "0207 555 9876",
    email: "priya.patel@arup.com",
    active: true,
  }
];

/* ======================================================================
   2. INITIAL LOAD (from localStorage or fallback to defaults)
   ====================================================================== */
let personnelStore = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn("METRA personnel store could not be read:", e);
  }
  return defaultPersonnel;
})();

/* ======================================================================
   3. SAVE TO STORAGE
   ====================================================================== */
const saveToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(personnelStore));
  } catch (e) {
    console.error("METRA personnel store could not be saved:", e);
  }
};

/* ======================================================================
   4. PUBLIC API
   ====================================================================== */
export const PersonnelBridge = {

  /* Read current list */
  getPersonnel: () => personnelStore,

  /* Update a person and persist */
  updatePerson: (id, updates) => {
    personnelStore = personnelStore.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    saveToStorage();
  }
};
