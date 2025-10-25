/* === METRA – Direct Component Mount Diagnostic ===
   Phase 9.4 – Root-Level Hydration Verification
   ----------------------------------------------
   Purpose: Ensure PreProjectChangeTest mounts directly to React root,
   bypassing App.jsx routing or stale import layers.
*/

import React from "react";
import ReactDOM from "react-dom/client";
import PreProjectChangeTest from "./components/PreProjectChangeTest.jsx";

console.log("🚀 Direct mount test starting...");

const root = document.getElementById("root");
console.log("Root element found:", root);

ReactDOM.createRoot(root).render(<PreProjectChangeTest />);
