/* === METRA – Root Mount (Phase 3.0b Integration) ===
   Switches from overlay test to full PreProject module
*/

import React from "react";
import ReactDOM from "react-dom/client";
import PreProject from "./components/PreProject.jsx";

console.log("🚀 METRA: PreProject Phase 3 – Embedded Popup Test starting...");

const root = document.getElementById("root");
console.log("Root element located:", root);

ReactDOM.createRoot(root).render(<PreProject />);
