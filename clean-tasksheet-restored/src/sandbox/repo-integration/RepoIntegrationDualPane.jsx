/* ======================================================================
   METRA – RepoIntegrationDualPane.jsx
   ----------------------------------------------------------------------
   SANDBOX-ONLY DualPane Controller

   ✔ Owns sandbox summaries & tasks
   ✔ Reacts to repoPayload via useEffect
   ✔ No globals
   ✔ Single source of truth
   ====================================================================== */

import React, { useState, useEffect } from "react";
import DualPane from "../../components/DualPane";
import { adaptRepoPayloadToWorkspace } from "./repoPayloadAdapter";

export default function RepoIntegrationDualPane({ repoPayload }) {

  const [mgmtSummaries, setMgmtSummaries] = useState([]);
  const [mgmtTasks, setMgmtTasks] = useState([]);
  const [devSummaries, setDevSummaries] = useState([]);
  const [devTasks, setDevTasks] = useState([]);

  /* ===============================================================
     REACT TO REPOSITORY PAYLOAD
     =============================================================== */
  useEffect(() => {
    if (!repoPayload) return;

    console.group("🧩 REPO IMPORT – SANDBOX (PROP-DRIVEN)");
    console.log("Incoming repo payload:", repoPayload);

    const { summaries, tasks } =
      adaptRepoPayloadToWorkspace(repoPayload);

    if (repoPayload.type === "Mgmt") {
      setMgmtSummaries(summaries);
      setMgmtTasks(tasks);
    }

    if (repoPayload.type === "Dev") {
      setDevSummaries(summaries);
      setDevTasks(tasks);
    }

    console.log("Imported summaries:", summaries);
    console.log("Imported tasks:", tasks);
    console.groupEnd();

  }, [repoPayload]);

  /* ===============================================================
     RENDER PURE DUALPANE
     =============================================================== */
  return (
    <DualPane
      mgmtSummaries={mgmtSummaries}
      setMgmtSummaries={setMgmtSummaries}
      mgmtTasks={mgmtTasks}
      setMgmtTasks={setMgmtTasks}
      devSummaries={devSummaries}
      setDevSummaries={setDevSummaries}
      devTasks={devTasks}
      setDevTasks={setDevTasks}
      sandboxMode={true}
    />
  );
}
