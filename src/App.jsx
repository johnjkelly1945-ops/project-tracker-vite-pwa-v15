/* ======================================================================
   METRA – App.jsx
   Includes:
   • Global header
   • DualPane workspace
   • TaskRepository modal (on demand)
   ====================================================================== */

import React, { useState } from "react";
import DualPane from "./components/DualPane.jsx";
import ModuleHeader from "./components/ModuleHeader.jsx";
import TaskRepository from "./components/TaskRepository.jsx";

export default function App() {
  const [showRepo, setShowRepo] = useState(false);

  return (
    <div className="app-container">

      {/* Header with button that opens the Repository */}
      <ModuleHeader onOpenRepository={() => setShowRepo(true)} />

      {/* Main workspace */}
      <DualPane />

      {/* Repository Modal */}
      {showRepo && (
        <TaskRepository
          onClose={() => setShowRepo(false)}
        />
      )}

    </div>
  );
}
