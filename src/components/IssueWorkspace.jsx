/*
======================================================================

METRA — IssueWorkspace.jsx
Stage 500V — Constitutional Issue Workspace Boundary

PURPOSE
-------
Constitutional destination for Issue lifecycle.

IssueWorkspace delegates lifecycle ownership to
IssueWorkspaceProvider.

======================================================================
*/

import IssueWorkspaceProvider from "./IssueWorkspaceProvider";

export default function IssueWorkspace(props) {
  return (
    <IssueWorkspaceProvider {...props} />
  );
}
