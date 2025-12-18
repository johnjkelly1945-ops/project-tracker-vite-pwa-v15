/* ======================================================================
   METRA – Document Factory
   Stage 10.2 – Canonical Document Data Model
   ----------------------------------------------------------------------
   PURPOSE:
   • Instantiate a document from a template
   • Preserve full provenance
   • No UI logic
   • No persistence
   • No external dependencies
   ====================================================================== */

/* ----------------------------------------------------------------------
   INTERNAL ID GENERATOR
   ----------------------------------------------------------------------
   • Deterministic
   • Dependency-free
   • Sufficient for in-memory + persisted documents
   ---------------------------------------------------------------------- */
function generateDocumentId() {
  return (
    "doc-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 8)
  );
}

/* ----------------------------------------------------------------------
   createDocumentFromTemplate
   ----------------------------------------------------------------------
   INPUT:
   • template  (from templateLibrary)
   • options   (linkedTo, linkedType, createdBy, notes)
   ----------------------------------------------------------------------
   OUTPUT:
   • Plain document object (data only)
   ---------------------------------------------------------------------- */
export function createDocumentFromTemplate(template, options = {}) {
  if (!template || !template.id) {
    throw new Error("Invalid template supplied to document factory");
  }

  const now = new Date().toISOString();

  return {
    /* === Identity === */
    id: generateDocumentId(),
    originTemplateId: template.id,
    documentType: template.documentType,

    /* === Classification === */
    title: template.title,
    category: template.category,
    governanceType: template.governanceType,

    /* === Structure === */
    sections: template.sections.map((section) => ({
      heading: section,
      content: ""
    })),

    /* === Linkage (no behaviour yet) === */
    linkedTo: options.linkedTo || null,
    linkedType: options.linkedType || null, // "task" | "summary" | "project" | "test"

    /* === Governance-ready fields === */
    status: "draft",
    version: 1,

    /* === Audit === */
    createdAt: now,
    createdBy: options.createdBy || "system",
    lastModifiedAt: now,

    /* === Notes / annotations === */
    notes: options.notes || ""
  };
}
