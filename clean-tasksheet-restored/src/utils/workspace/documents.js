/* ======================================================================
   METRA — Workspace Document Helpers
   Stage 11.2.6 — In-Memory, Workspace-Scoped Documents
   ----------------------------------------------------------------------
   RULES ENFORCED:
   • Documents are first-class workspace entities
   • Documents are NOT owned by tasks
   • Tasks link to documents by ID only
   • Documents survive task delete / archive
   • In-memory only (no persistence)
   • No UI, no repo mutation
   ====================================================================== */

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
   Create Document
   -------------------------------------------------------------- */

/**
 * Creates a new workspace document.
 * @param {Object} options
 * @param {string} options.title
 * @param {"workspace"|"repo"} options.source
 * @param {string|null} options.templateId
 * @param {string} options.createdBy
 */
export function createWorkspaceDocument({
  title = "Untitled Document",
  source = "workspace",
  templateId = null,
  createdBy = "user"
}) {
  return {
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
}

/* --------------------------------------------------------------
   Link Document ↔ Task
   -------------------------------------------------------------- */

/**
 * Links a document to a task.
 * Returns updated copies of both entities.
 */
export function linkDocumentToTask(document, task) {
  if (!document || !task) return { document, task };

  const docLinked =
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

  const taskLinked =
    task.documents?.includes(document.id)
      ? task
      : {
          ...task,
          documents: [...(task.documents || []), document.id]
        };

  return {
    document: docLinked,
    task: taskLinked
  };
}

/* --------------------------------------------------------------
   Unlink Document ↔ Task
   -------------------------------------------------------------- */

/**
 * Unlinks a document from a task.
 * Document is NOT deleted.
 */
export function unlinkDocumentFromTask(document, task) {
  if (!document || !task) return { document, task };

  const docUnlinked = {
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

  const taskUnlinked = {
    ...task,
    documents: (task.documents || []).filter(id => id !== document.id)
  };

  return {
    document: docUnlinked,
    task: taskUnlinked
  };
}
