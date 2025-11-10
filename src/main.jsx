/* ======================================================================
   METRA – main.jsx (Stable Entry Point)
   ----------------------------------------------------------------------
   Mounts App.jsx to #root using React 18 createRoot API.
   ====================================================================== */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

