import React from "react";
import ReactDOM from "react-dom/client";

// ⭐ RUN SANDBOX APP (with ToastProvider built in)
import RepoIntegrationApp from "./sandbox/repo-integration/RepoIntegrationApp.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RepoIntegrationApp />
  </React.StrictMode>
);
