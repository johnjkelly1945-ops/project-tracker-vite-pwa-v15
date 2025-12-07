/* ======================================================================
   METRA – App.jsx (Clean Tasksheet Recovery)
   Ensures PreProject loads as the main visible component.
   ====================================================================== */

import React from "react";
import PreProject from "./components/PreProject";

export default function App() {
  return (
    <div className="App">
      <PreProject />
    </div>
  );
}
