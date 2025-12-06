/* ======================================================================
   METRA – templateLibrary.js
   ----------------------------------------------------------------------
   Professional Template Repository (Management + Development)
   • Management templates organised by method:
       PRINCE2, PMBOK, Agile, MSP, Generic Management
   • Development templates organised by projectType:
       Software Development, Construction, Relocation,
       Business Transformation, Operations, Generic Development
   • Each template includes:
       - id
       - group
       - method OR projectType
       - name
       - description
       - keywords[]
       - blocks[]
       - fileURL (DOCX in /public/templates/)
   ====================================================================== */

export const templateLibrary = [

  /* ============================================================
     PART 1 — MANAGEMENT TEMPLATES
     ============================================================ */

  /* --------------------------- PRINCE2 ------------------------ */
  {
    id: 1,
    group: "Management",
    method: "PRINCE2",
    name: "Business Case",
    description: "Defines justification, benefits, options, and expected outcomes.",
    keywords: ["business", "case", "prince2", "benefits"],
    blocks: [
      { label: "Executive Summary" },
      { label: "Reasons" },
      { label: "Options" },
      { label: "Expected Benefits" },
      { label: "Risks" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/business-case_v1.docx"
  },

  {
    id: 2,
    group: "Management",
    method: "PRINCE2",
    name: "Project Brief",
    description: "Summarises project objectives, scope, constraints, and stakeholders.",
    keywords: ["prince2", "brief"],
    blocks: [
      { label: "Project Definition" },
      { label: "Project Approach" },
      { label: "Business Case Summary" },
      { label: "Stakeholder Summary" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/project-brief_v1.docx"
  },

  {
    id: 3,
    group: "Management",
    method: "PRINCE2",
    name: "Project Initiation Document (PID)",
    description: "Full definition of the project for authorisation and control.",
    keywords: ["PID", "prince2"],
    blocks: [
      { label: "Project Organisation" },
      { label: "Quality Management" },
      { label: "Risk Management" },
      { label: "Plans" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/pid-project-initiation-document_v1.docx"
  },

  {
    id: 4,
    group: "Management",
    method: "PRINCE2",
    name: "Risk Register",
    description: "Captures identified risks, impact, likelihood and actions.",
    keywords: ["risk", "register"],
    blocks: [
      { label: "Risk Description" },
      { label: "Impact Assessment" },
      { label: "Likelihood" },
      { label: "Mitigation Actions" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/risk-assessment_v1.docx"
  },

  {
    id: 5,
    group: "Management",
    method: "PRINCE2",
    name: "Lessons Log",
    description: "Captures lessons for use throughout the project lifecycle.",
    keywords: ["lessons", "log"],
    blocks: [
      { label: "Lesson Description" },
      { label: "Recommendation" },
      { label: "Application" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/lessons-learned_v1.docx"
  },

  /* --------------------------- PMBOK -------------------------- */

  {
    id: 6,
    group: "Management",
    method: "PMBOK",
    name: "Project Charter",
    description: "Authorises the project and establishes the project manager.",
    keywords: ["charter", "PMBOK"],
    blocks: [
      { label: "Purpose" },
      { label: "High-Level Requirements" },
      { label: "Budget Summary" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/finance-request_v1.docx"
  },

  {
    id: 7,
    group: "Management",
    method: "PMBOK",
    name: "Stakeholder Register",
    description: "Documents stakeholders, interests, and influence.",
    keywords: ["stakeholder"],
    blocks: [
      { label: "Stakeholder List" },
      { label: "Influence Assessment" },
      { label: "Engagement Strategy" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/stakeholder-analysis_v1.docx"
  },

  {
    id: 8,
    group: "Management",
    method: "PMBOK",
    name: "Communications Plan",
    description: "Defines communication channels, frequency, and ownership.",
    keywords: ["communications"],
    blocks: [
      { label: "Stakeholder Needs" },
      { label: "Communication Schedule" },
      { label: "Reporting Format" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/communication-plan_v1.docx"
  },

  /* --------------------------- AGILE -------------------------- */

  {
    id: 10,
    group: "Management",
    method: "Agile",
    name: "Product Vision",
    description: "Describes the long-term strategic vision for the product.",
    keywords: ["agile", "vision"],
    blocks: [
      { label: "Vision Statement" },
      { label: "Target Users" },
      { label: "Key Benefits" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/as-is-analysis_v1.docx"
  },

  {
    id: 11,
    group: "Management",
    method: "Agile",
    name: "Product Backlog Structure",
    description: "Defines epics, features, and user story structure.",
    keywords: ["backlog", "stories"],
    blocks: [
      { label: "Epic Structure" },
      { label: "User Story Template" },
      { label: "Acceptance Criteria" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/ui-ux-requirements_v1.docx"
  },

  {
    id: 12,
    group: "Management",
    method: "Agile",
    name: "Sprint Planning Checklist",
    description: "Ensures readiness to start a new sprint.",
    keywords: ["sprint"],
    blocks: [
      { label: "Capacity Review" },
      { label: "Carry-Over Items" },
      { label: "Story Prioritisation" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/inspection-test-plan_v1.docx"
  },

  /* --------------------------- MSP ---------------------------- */

  {
    id: 13,
    group: "Management",
    method: "MSP",
    name: "Programme Brief",
    description: "Defines vision, drivers, constraints and high-level governance.",
    keywords: ["programme"],
    blocks: [
      { label: "Vision" },
      { label: "Drivers & Objectives" },
      { label: "Governance" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/programme-brief_v1.docx"
  },

  {
    id: 14,
    group: "Management",
    method: "MSP",
    name: "Blueprint Design",
    description: "Describes the future operating model and capability changes.",
    keywords: ["blueprint"],
    blocks: [
      { label: "Current State" },
      { label: "Future State" },
      { label: "Gap Analysis" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/programme-blueprint_v1.docx"
  },

  {
    id: 15,
    group: "Management",
    method: "MSP",
    name: "Benefits Profile",
    description: "Defines planned benefits, metrics and measurement approach.",
    keywords: ["benefits"],
    blocks: [
      { label: "Benefit Description" },
      { label: "KPIs" },
      { label: "Realisation Plan" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/benefits-profile_v1.docx"
  },

  /* -------------------- GENERIC MANAGEMENT -------------------- */

  {
    id: 16,
    group: "Management",
    method: "Generic Management",
    name: "Meeting Agenda",
    description: "Structured agenda for project meetings.",
    keywords: ["meeting"],
    blocks: [
      { label: "Topics" },
      { label: "Actions" },
      { label: "Decisions" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/meeting-agenda_v1.docx"
  },

  {
    id: 17,
    group: "Management",
    method: "Generic Management",
    name: "Issue Log",
    description: "Tracks project issues, owners, and resolution dates.",
    keywords: ["issues"],
    blocks: [
      { label: "Issue Description" },
      { label: "Owner" },
      { label: "Resolution" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/issues-log-template_v1.docx"
  },

  {
    id: 18,
    group: "Management",
    method: "Generic Management",
    name: "Decision Record",
    description: "Captures key project decisions and rationale.",
    keywords: ["decision"],
    blocks: [
      { label: "Decision" },
      { label: "Rationale" },
      { label: "Date" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/decision-log_v1.docx"
  },

  {
    id: 19,
    group: "Management",
    method: "Generic Management",
    name: "High-Level Requirements Sheet",
    description: "Captures initial requirements and constraints.",
    keywords: ["requirements"],
    blocks: [
      { label: "Requirement Summary" },
      { label: "Dependencies" },
      { label: "Constraints" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/high-level-requirements_v1.docx"
  },

  /* ============================================================
     PART 2 — DEVELOPMENT TEMPLATES
     ============================================================ */

  /* -------------------- SOFTWARE DEVELOPMENT ----------------- */

  {
    id: 20,
    group: "Development",
    projectType: "Software Development",
    name: "API Specification",
    description: "Defines API endpoints, request/response payloads, authentication, and error handling.",
    keywords: ["api", "software"],
    blocks: [
      { label: "Endpoints" },
      { label: "Payloads" },
      { label: "Authentication" },
      { label: "Error Handling" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/api-specification_v1.docx"
  },

  {
    id: 21,
    group: "Development",
    projectType: "Software Development",
    name: "UI/UX Requirements",
    description: "Captures user flows, interface layouts, usability requirements, and accessibility expectations.",
    keywords: ["ui", "ux"],
    blocks: [
      { label: "User Flows" },
      { label: "UI Layouts" },
      { label: "Accessibility" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/ui-ux-requirements_v1.docx"
  },

  {
    id: 22,
    group: "Development",
    projectType: "Software Development",
    name: "Functional Specification",
    description: "Describes behaviour, flows, and requirements of the system.",
    keywords: ["functional"],
    blocks: [
      { label: "Functional Requirements" },
      { label: "Process Flows" },
      { label: "Business Rules" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/architecture-review_v1.docx"
  },

  /* --------------------------- CONSTRUCTION ------------------ */

  {
    id: 24,
    group: "Development",
    projectType: "Construction",
    name: "Site Risk Assessment",
    description: "Evaluates hazards, controls, and site risks.",
    keywords: ["risk"],
    blocks: [
      { label: "Site Description" },
      { label: "Hazard Assessment" },
      { label: "Control Measures" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/site-risk-assessment_v1.docx"
  },

  {
    id: 25,
    group: "Development",
    projectType: "Construction",
    name: "Method Statement",
    description: "Defines safe working methods for construction activities.",
    keywords: ["method", "construction"],
    blocks: [
      { label: "Work Description" },
      { label: "Equipment" },
      { label: "Safety Controls" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/method-statement_v1.docx"
  },

  /* ------------------------- RELOCATION ------------------------ */

  {
    id: 27,
    group: "Development",
    projectType: "Relocation",
    name: "Move Plan Checklist",
    description: "Ensures coordination and minimal disruption for relocations.",
    keywords: ["move"],
    blocks: [
      { label: "Preparation" },
      { label: "Logistics" },
      { label: "Execution" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/move-schedule_v1.docx"
  },

  {
    id: 28,
    group: "Development",
    projectType: "Relocation",
    name: "Equipment Inventory Sheet",
    description: "Tracks equipment for relocation planning.",
    keywords: ["equipment"],
    blocks: [
      { label: "Asset List" },
      { label: "Condition" },
      { label: "Destination Assignment" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/asset-inventory_v1.docx"
  },

  /* ------------------- BUSINESS TRANSFORMATION ---------------- */

  {
    id: 30,
    group: "Development",
    projectType: "Business Transformation",
    name: "Current State Assessment",
    description: "Analyses existing processes, capabilities, and performance.",
    keywords: ["current state"],
    blocks: [
      { label: "Process Overview" },
      { label: "Pain Points" },
      { label: "KPIs" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/as-is-analysis_v1.docx"
  },

  {
    id: 31,
    group: "Development",
    projectType: "Business Transformation",
    name: "Target Operating Model Canvas",
    description: "Defines the future business model and capabilities.",
    keywords: ["TOM"],
    blocks: [
      { label: "Vision" },
      { label: "Capabilities" },
      { label: "Operating Model" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/to-be-design_v1.docx"
  },

  /* ------------------------------ OPERATIONS ------------------- */

  {
    id: 33,
    group: "Development",
    projectType: "Operations",
    name: "Standard Operating Procedure (SOP)",
    description: "Defines operational steps for consistent performance.",
    keywords: ["SOP"],
    blocks: [
      { label: "Procedure Steps" },
      { label: "Safety Checks" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/sop-template_v1.docx"
  },

  {
    id: 34,
    group: "Development",
    projectType: "Operations",
    name: "Maintenance Log",
    description: "Tracks equipment maintenance activity and outcomes.",
    keywords: ["maintenance"],
    blocks: [
      { label: "Inspection" },
      { label: "Repairs" },
      { label: "Service Dates" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/operational-procedure_v1.docx"
  },

  /* ============================================================
     PART 3 — GENERIC DEVELOPMENT
     ============================================================ */

  {
    id: 36,
    group: "Development",
    projectType: "Generic Development",
    name: "Task Breakdown Sheet",
    description: "Breaks work into manageable tasks.",
    keywords: ["task breakdown"],
    blocks: [
      { label: "Task List" },
      { label: "Dependencies" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/work-package_v1.docx"
  },

  {
    id: 37,
    group: "Development",
    projectType: "Generic Development",
    name: "Acceptance Criteria Checklist",
    description: "Defines acceptance expectations for deliverables.",
    keywords: ["acceptance"],
    blocks: [
      { label: "Criteria List" },
      { label: "Priority" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/acceptance-criteria_v1.docx"
  },

  {
    id: 38,
    group: "Development",
    projectType: "Generic Development",
    name: "Test Summary Sheet",
    description: "Summarises outcomes of testing activities.",
    keywords: ["test summary"],
    blocks: [
      { label: "Test Cases" },
      { label: "Results Summary" }
    ],
    fileURL: "/templates/metra_blank_templates_v1/test-plan_v1.docx"
  }
];
