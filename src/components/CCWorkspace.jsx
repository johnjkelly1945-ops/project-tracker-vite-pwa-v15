// @ts-nocheck

/*
======================================================================

METRA — CCWorkspace.jsx
Stage 500V — Constitutional CC Workspace Boundary

PURPOSE
-------
Constitutional destination for CC lifecycle.

CCWorkspace delegates lifecycle ownership to
CCWorkspaceProvider.

======================================================================
*/

import CCWorkspaceProvider from "./CCWorkspaceProvider";

export default function CCWorkspace(props) {
  return (
    <CCWorkspaceProvider {...props} />
  );
}
