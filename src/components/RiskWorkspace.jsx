// @ts-nocheck

/*
======================================================================

METRA — RiskWorkspace.jsx
Stage 500V — Constitutional Risk Workspace Boundary

PURPOSE
-------
Constitutional destination for Risk lifecycle.

RiskWorkspace delegates lifecycle ownership to
RiskWorkspaceProvider.

======================================================================
*/

import RiskWorkspaceProvider from "./RiskWorkspaceProvider";

export default function RiskWorkspace(props) {
  return (
    <RiskWorkspaceProvider {...props} />
  );
}
