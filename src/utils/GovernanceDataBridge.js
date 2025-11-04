/* ======================================================================
   METRA – GovernanceDataBridge.js
   Phase 4.6 A.8 – Verified Live Feed Middleware
   ----------------------------------------------------------------------
   Fetches Governance Summary data from /public/data/ directory
   and provides it via React hook for both dashboards.
   ====================================================================== */

import { useState, useEffect } from "react";

export async function fetchGovernanceData() {
  try {
    // ✅ Corrected path – remove leading slash
    const response = await fetch("data/governance-summary.json", {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    if (!response.ok) throw new Error(`Network error: ${response.status}`);
    const data = await response.json();

    console.log(
      "GovernanceDataBridge → loaded",
      data.length,
      "programme records"
    );

    // Sort projects by programme or project name for consistency
    return data.sort((a, b) =>
      (a.programme || "").localeCompare(b.programme || "")
    );
  } catch (error) {
    console.error("GovernanceDataBridge → fetch error:", error);
    return [];
  }
}

/* ----------------------------------------------------------------------
   React Hook – Live Data Bridge
   Periodically refreshes governance data to keep dashboards current.
   ---------------------------------------------------------------------- */
export function useGovernanceDataBridge(refreshInterval = 10000) {
  const [governanceData, setGovernanceData] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadData() {
      const latest = await fetchGovernanceData();
      if (active) setGovernanceData(latest);
    }

    loadData(); // Initial fetch
    const interval = setInterval(loadData, refreshInterval);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [refreshInterval]);

  return governanceData;
}
