/* ============================================================
   METRA – usePersonnelData Hook
   Phase 4.6 A.5 Step 6 – Shared Personnel Integration
   ------------------------------------------------------------
   Provides a central source of personnel data (mock or live).
   Will later connect to Personnel module / API.
   ============================================================ */

import { useEffect, useState } from "react";

export default function usePersonnelData() {
  const [personnel, setPersonnel] = useState([]);

  useEffect(() => {
    // Mock data for now; replace later with live fetch
    const samplePersonnel = [
      { id: 1, name: "Alice Robertson", role: "Admin", email: "alice@metra.io" },
      { id: 2, name: "David Ng", role: "PMO", email: "david@metra.io" },
      { id: 3, name: "Maria Santos", role: "Manager", email: "maria@metra.io" },
      { id: 4, name: "Liam Turner", role: "User", email: "liam@metra.io" },
    ];
    setPersonnel(samplePersonnel);
  }, []);

  return personnel;
}
