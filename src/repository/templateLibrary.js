/* ======================================================================
   METRA – Template Library
   Stage 10.1 – Canonical Template Repository (Read-Only)
   ----------------------------------------------------------------------
   PURPOSE:
   • Defines document templates only
   • No UI logic
   • No task creation
   • No governance activation
   • Safe for deterministic imports
   ====================================================================== */

export const templateLibrary = [
  {
    id: "tpl-business-case",
    title: "Business Case",
    category: "Governance",
    documentType: "BusinessCase",
    methodology: ["PRINCE2", "PMBOK", "Generic"],
    phase: ["Initiation"],
    governanceType: "ChangeControl",
    description: "Formal justification for initiating or continuing a project.",
    sections: [
      "Executive Summary",
      "Strategic Alignment",
      "Options Analysis",
      "Costs & Benefits",
      "Risks & Assumptions",
      "Recommendation"
    ]
  },

  {
    id: "tpl-project-charter",
    title: "Project Charter",
    category: "Foundation",
    documentType: "Charter",
    methodology: ["PMBOK", "Generic"],
    phase: ["Initiation"],
    governanceType: "Authority",
    description: "Authorises the project and defines high-level scope and ownership.",
    sections: [
      "Purpose",
      "Objectives",
      "Scope",
      "Key Stakeholders",
      "High-Level Risks",
      "Approval"
    ]
  },

  {
    id: "tpl-risk-register",
    title: "Risk Register",
    category: "Governance",
    documentType: "RiskRegister",
    methodology: ["PRINCE2", "PMBOK", "Agile", "Generic"],
    phase: ["Initiation", "Delivery"],
    governanceType: "Risk",
    description: "Structured register for identifying and tracking project risks.",
    sections: [
      "Risk Description",
      "Cause",
      "Impact",
      "Likelihood",
      "Mitigation",
      "Owner",
      "Status"
    ]
  }
];
