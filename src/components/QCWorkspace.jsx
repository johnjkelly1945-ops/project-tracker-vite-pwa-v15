/*
======================================================================

METRA — QCWorkspace.jsx
Stage 500V — Constitutional QC Workspace Boundary

PURPOSE
-------
Constitutional destination for QC lifecycle.

QCWorkspace delegates lifecycle ownership to
QCWorkspaceProvider.

======================================================================
*/

import QCWorkspaceProvider from "./QCWorkspaceProvider";

export default function QCWorkspace(props) {
  return (
    <QCWorkspaceProvider {...props} />
  );
}
