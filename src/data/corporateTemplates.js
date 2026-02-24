/* ================================================================
   METRA — Corporate Template Dataset (Stage 348 v1)
   Canon: SEM-ID-01 compliant
   Layer: Corporate (Static, In-Memory)
   ================================================================ */

export const corporateTemplates = [

  /* --------------------------------------------------------------
     SUMMARY TEMPLATES
     -------------------------------------------------------------- */

  {
    id: "summary-project-charter-v1",
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
    templateType: "summary",
    version: 1,
    status: "active"
  },

  /* --------------------------------------------------------------
     TASK TEMPLATES
     -------------------------------------------------------------- */

  {
    id: "task-product-definition-v1",
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
    templateType: "task",
    version: 1,
    status: "active"
  },

  {
    id: "task-generic-instruction-v1",
    title: "Generic Task Instruction",
    description:
`Task Purpose:
Clearly describe the work to be performed.

Inputs:
List required inputs or dependencies.

Deliverable:
Describe the expected output.`,
    discipline: "both",
    templateType: "task",
    version: 1,
    status: "active"
  },

  /* --------------------------------------------------------------
     TASK DESCRIPTION INSERT TEMPLATES
     -------------------------------------------------------------- */

  {
    id: "task-description-checklist-v1",
    title: "Task Description Checklist",
    description:
`Checklist:
- Clarify scope
- Identify constraints
- Confirm acceptance conditions`,
    discipline: "both",
    templateType: "taskDescription",
    version: 1,
    status: "active"
  }

];
