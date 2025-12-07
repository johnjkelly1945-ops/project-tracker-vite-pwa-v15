/* ======================================================================
   METRA – main.jsx (Clean Tasksheet Recovery)
   React 18 strict render + mounts App.jsx into #root
   ====================================================================== */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./Styles/App.v2.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
