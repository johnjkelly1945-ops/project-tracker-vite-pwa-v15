/* ======================================================================
   METRA – Document Factory
   Stage 10.2 – Canonical Document Data Model
   ----------------------------------------------------------------------
   PURPOSE:
   • Instantiate a document from a template
   • Preserve full provenance
   • No UI logic
   • No persistence
   • No task / summary mutation
   ====================================================================== */

import { v4 as uuidv4 } from "uuid";

/* ----------------------------------------------------------------------
   createDocumentFromTemplate
   ----------------------------------------------------------------------
   INPUT:
   • template  (from templateLibrary)
   • options   (optional metadata: linkedTo, createdBy, notes)
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
    id: `doc-${uuidv4()}`,
    originTemplateId: template.id,
    documentType: template.documentType,

    /* === Classification === */
    title: template.title,
    category: template.category,
    governanceType: template.governanceType,

    /* === Structure === */
    sections: template.sections.map(section => ({
      heading: section,
      content: ""
    })),

    /* === Linkage (no behaviour yet) === */
    linkedTo: options.linkedTo || null,
    linkedType: options.linkedType || null, // "task" | "summary" | "project"

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
