import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

/* Order matters slightly. Load global CSS first. */
import "./Styles/App.v2.css";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
