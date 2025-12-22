/* ======================================================================
   METRA – PreProject.jsx
   Stage 12.1-B – Workspace with Repository Modal Hosting (Intent-Only)
   ====================================================================== */

import React, { useEffect, useState } from "react";
import PreProjectDual from "./PreProjectDual";
import PreProjectFooter from "./PreProjectFooter";
import RepositoryView from "./RepositoryView";

export default function PreProject() {
  const [isRepoOpen, setRepoOpen] = useState(false);

  useEffect(() => {
    const handleIntent = (event) => {
      const { type } = event.detail || {};

      if (type === "OPEN_REPOSITORY_INTENT") {
        setRepoOpen(true);
      }

      if (type === "CLOSE_REPOSITORY_INTENT") {
        setRepoOpen(false);
      }
    };

    window.addEventListener("METRA_INTENT", handleIntent);
    return () => window.removeEventListener("METRA_INTENT", handleIntent);
  }, []);

  return (
    <div className="preproject-container">
      <PreProjectDual />
      <PreProjectFooter />

      {isRepoOpen && (
        <div className="repo-modal-overlay">
          <div className="repo-modal">
            <RepositoryView />
          </div>
        </div>
      )}
    </div>
  );
}
