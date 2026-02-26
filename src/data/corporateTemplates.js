/* ================================================================
   METRA — Corporate Template Dataset (Stage 350 Phase 2)
   Canon: Bundle Doctrine + Dimension Modelling (Additive Only)
   Layer: Corporate (Static, In-Memory)
   ================================================================ */

export const corporateTemplates = [

  /* --------------------------------------------------------------
     BUNDLES — MANAGEMENT
     -------------------------------------------------------------- */

  {
    id: "bundle-programme-launch-pack-v1",
    entityType: "bundle",
    type: "bundle",
    method: "standard",
    scope: "management",
    level: "core",
    title: "Programme Launch Pack",
    discipline: "management",
    contains: [
      "summary-project-charter-v1"
    ],
    version: 1,
    status: "active"
  },

  {
    id: "bundle-governance-setup-pack-v1",
    entityType: "bundle",
    type: "bundle",
    method: "standard",
    scope: "management",
    level: "core",
    title: "Governance Setup Pack",
    discipline: "management",
    contains: [
      "summary-project-charter-v1"
    ],
    version: 1,
    status: "active"
  },

  /* --------------------------------------------------------------
     BUNDLES — DEVELOPMENT
     -------------------------------------------------------------- */

  {
    id: "bundle-product-definition-pack-v1",
    entityType: "bundle",
    type: "bundle",
    method: "standard",
    scope: "development",
    level: "core",
    title: "Product Definition Pack",
    discipline: "development",
    contains: [
      "summary-product-scope-v1"
    ],
    version: 1,
    status: "active"
  },

  {
    id: "bundle-dev-core-setup-pack-v1",
    entityType: "bundle",
    type: "bundle",
    method: "standard",
    scope: "development",
    level: "core",
    title: "Development Core Setup Pack",
    discipline: "development",
    contains: [
      "summary-product-scope-v1"
    ],
    version: 1,
    status: "active"
  },

  /* --------------------------------------------------------------
     SUMMARY TEMPLATES
     -------------------------------------------------------------- */

  {
    id: "summary-project-charter-v1",
    entityType: "summary",
    type: "summary",
    method: "standard",
    scope: "management",
    level: "core",
    templateType: "summary",
    title: "Project Charter Summary",
    description:
`Purpose:
Define the strategic intent and scope of this project.

Objectives:
- Clarify business need
- Define measurable outcomes
- Identify primary stakeholders

Success Criteria:
- Clearly defined scope
- Agreed outcomes
- Approved sponsor`,
    discipline: "management",
    version: 1,
    status: "active"
  },

  {
    id: "summary-product-scope-v1",
    entityType: "summary",
    type: "summary",
    method: "standard",
    scope: "development",
    level: "core",
    templateType: "summary",
    title: "Product Scope Summary",
    description:
`Purpose:
Define the scope and functional boundaries of the product.

Objectives:
- Clarify core features
- Identify constraints
- Confirm acceptance boundaries

Success Criteria:
- Scope agreed
- Stakeholders aligned
- Constraints documented`,
    discipline: "development",
    version: 1,
    status: "active"
  },

  /* --------------------------------------------------------------
     TASK TEMPLATES (FIRST-CLASS, LINKED NOT OWNED)
     -------------------------------------------------------------- */

  {
    id: "task-product-definition-v1",
    entityType: "task",
    type: "task",
    method: "standard",
    scope: "development",
    level: "core",
    templateType: "task",
    linkedSummaryIds: [
      "summary-product-scope-v1"
    ],
    title: "Product Definition Task",
    description:
`Product Overview:
Describe the product or feature clearly.

Functional Requirements:
- List primary behaviours
- Define user expectations

Acceptance Criteria:
- Define measurable acceptance tests`,
    discipline: "development",
    version: 1,
    status: "active"
  },

  {
    id: "task-generic-instruction-v1",
    entityType: "task",
    type: "task",
    method: "standard",
    scope: "both",
    level: "core",
    templateType: "task",
    linkedSummaryIds: [
      "summary-project-charter-v1"
    ],
    title: "Generic Task Instruction",
    description:
`Task Purpose:
Clearly describe the work to be performed.

Inputs:
List required inputs or dependencies.

Deliverable:
Describe the expected output.`,
    discipline: "both",
    version: 1,
    status: "active"
  },

  /* --------------------------------------------------------------
     OPERATIONAL INSERT TEMPLATES
     -------------------------------------------------------------- */

  {
    id: "task-description-checklist-v1",
    entityType: "operational",
    type: "operational",
    method: "standard",
    scope: "both",
    level: "core",
    templateType: "taskDescription",
    title: "Task Description Checklist",
    description:
`Checklist:
- Clarify scope
- Identify constraints
- Confirm acceptance conditions`,
    discipline: "both",
    version: 1,
    status: "active"
  }

];
