/* ======================================================================
   METRA — Workspace Document Helpers
   Stage 11.2.8 — Helpers Wired to Workspace Store
   ----------------------------------------------------------------------
   RULES ENFORCED:
   • Documents are first-class workspace entities
   • Documents are NOT owned by tasks
   • Tasks link to documents by ID only
   • Documents survive task delete / archive
   • In-memory only (no persistence)
   • No UI, no repo mutation
   ====================================================================== */

import {
  workspaceStore,
  addDocument,
  updateDocument
} from "./workspaceStore";

/* --------------------------------------------------------------
   Utilities
   -------------------------------------------------------------- */

function generateId(prefix = "doc") {
  return `${prefix}-${crypto.randomUUID()}`;
}

function nowISO() {
  return new Date().toISOString();
}

/* --------------------------------------------------------------
   Create Document (AUTO-REGISTERS)
   -------------------------------------------------------------- */

/**
 * Creates a new workspace document and registers it
 * with the neutral workspace store.
 */
export function createWorkspaceDocument({
  title = "Untitled Document",
  source = "workspace",
  templateId = null,
  createdBy = "user"
}) {
  const document = {
    id: generateId(),
    title,
    type: "document",

    source,
    templateId,

    content: {
      format: "richtext",
      body: ""
    },

    links: {
      tasks: []
    },

    meta: {
      createdAt: nowISO(),
      createdBy,
      lastTouchedAt: nowISO()
    },

    state: {
      archived: false
    }
  };

  // 🔗 Auto-register with workspace store
  addDocument(document);

  return document;
}

/* --------------------------------------------------------------
   Link Document ↔ Task
   -------------------------------------------------------------- */

/**
 * Links a document to a task.
 * Updates are propagated to the workspace store.
 */
export function linkDocumentToTask(document, task) {
  if (!document || !task) return { document, task };

  const updatedDocument =
    document.links.tasks.includes(task.id)
      ? document
      : {
          ...document,
          links: {
            ...document.links,
            tasks: [...document.links.tasks, task.id]
          },
          meta: {
            ...document.meta,
            lastTouchedAt: nowISO()
          }
        };

  if (updatedDocument !== document) {
    updateDocument(updatedDocument);
  }

  const updatedTask =
    task.documents?.includes(document.id)
      ? task
      : {
          ...task,
          documents: [...(task.documents || []), document.id]
        };

  return {
    document: updatedDocument,
    task: updatedTask
  };
}

/* --------------------------------------------------------------
   Unlink Document ↔ Task
   -------------------------------------------------------------- */

/**
 * Unlinks a document from a task.
 * Document remains in the workspace store.
 */
export function unlinkDocumentFromTask(document, task) {
  if (!document || !task) return { document, task };

  const updatedDocument = {
    ...document,
    links: {
      ...document.links,
      tasks: document.links.tasks.filter(id => id !== task.id)
    },
    meta: {
      ...document.meta,
      lastTouchedAt: nowISO()
    }
  };

  updateDocument(updatedDocument);

  const updatedTask = {
    ...task,
    documents: (task.documents || []).filter(id => id !== document.id)
  };

  return {
    document: updatedDocument,
    task: updatedTask
  };
}

/* --------------------------------------------------------------
   Read Helpers (Optional, Safe)
   -------------------------------------------------------------- */

/**
 * Returns all workspace documents.
 * (Convenience passthrough; no mutation.)
 */
export function getAllWorkspaceDocuments() {
  return workspaceStore.documents;
}
