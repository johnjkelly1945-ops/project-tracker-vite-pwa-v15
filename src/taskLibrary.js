/* ======================================================================
   METRA - taskLibrary.js
   Demo Hierarchical Dataset (Stage 2A Testing)
   ----------------------------------------------------------------------
   This file contains:
   - 4 Bundles
   - 12 Summaries
   - 36 Tasks
   - Fully filterable by method, scope, level, type
   - Correct hierarchy: bundles -> summaries -> tasks
   - ASCII-only header to avoid Vite import-analysis errors
   ====================================================================== */

export const taskLibrary = {

  /* ================================================================
     SUMMARIES (12 Items)
     ================================================================ */
  summaries: [
    // Project Initiation
    {
      id: "s1",
      name: "Project Initiation Summary",
      method: "PRINCE2",
      scope: "Software",
      level: "Project",
      type: "Mgmt",
      tasks: ["t1", "t2", "t3"]
    },
    {
      id: "s2",
      name: "Business Case Development Summary",
      method: "PRINCE2",
      scope: "Software",
      level: "Project",
      type: "Mgmt",
      tasks: ["t4", "t5", "t6"]
    },
    {
      id: "s3",
      name: "Governance Setup Summary",
      method: "Generic",
      scope: "Software",
      level: "Project",
      type: "Mgmt",
      tasks: ["t7", "t8", "t9"]
    },

    // Programme Mobilisation
    {
      id: "s4",
      name: "Programme Mobilisation Summary",
      method: "MSP",
      scope: "Transformation",
      level: "Programme",
      type: "Mgmt",
      tasks: ["t10", "t11", "t12"]
    },
    {
      id: "s5",
      name: "Vision and Blueprinting Summary",
      method: "MSP",
      scope: "Transformation",
      level: "Programme",
      type: "Mgmt",
      tasks: ["t13", "t14", "t15"]
    },
    {
      id: "s6",
      name: "Benefits Strategy Summary",
      method: "MSP",
      scope: "Transformation",
      level: "Programme",
      type: "Mgmt",
      tasks: ["t16", "t17", "t18"]
    },

    // Delivery Controls
    {
      id: "s7",
      name: "Risk Management Summary",
      method: "Generic",
      scope: "Software",
      level: "Project",
      type: "Mgmt",
      tasks: ["t19", "t20", "t21"]
    },
    {
      id: "s8",
      name: "Quality Control Summary",
      method: "Generic",
      scope: "Software",
      level: "Project",
      type: "Mgmt",
      tasks: ["t22", "t23", "t24"]
    },
    {
      id: "s9",
      name: "Issue Management Summary",
      method: "Generic",
      scope: "Software",
      level: "Project",
      type: "Mgmt",
      tasks: ["t25", "t26", "t27"]
    },

    // Change and Delivery
    {
      id: "s10",
      name: "Change Control Summary",
      method: "Generic",
      scope: "Software",
      level: "Project",
      type: "Mgmt",
      tasks: ["t28", "t29", "t30"]
    },
    {
      id: "s11",
      name: "Transition Planning Summary",
      method: "MSP",
      scope: "Transformation",
      level: "Programme",
      type: "Mgmt",
      tasks: ["t31", "t32", "t33"]
    },
    {
      id: "s12",
      name: "Programme Delivery Summary",
      method: "MSP",
      scope: "Transformation",
      level: "Programme",
      type: "Mgmt",
      tasks: ["t34", "t35", "t36"]
    }
  ],

  /* ================================================================
     TASKS (36 Items)
     ================================================================ */
  tasks: [
    // Project Initiation Summary (s1)
    { id: "t1",  name: "Create Project Brief", method: "PRINCE2", scope: "Software", level: "Project", type: "Mgmt" },
    { id: "t2",  name: "Define Project Approach", method: "PRINCE2", scope: "Software", level: "Project", type: "Mgmt" },
    { id: "t3",  name: "Conduct Initial Stakeholder Mapping", method: "PRINCE2", scope: "Software", level: "Project", type: "Mgmt" },

    // Business Case Development Summary (s2)
    { id: "t4",  name: "Define Project Justification", method: "PRINCE2", scope: "Software", level: "Project", type: "Mgmt" },
    { id: "t5",  name: "Identify Options and Feasibility", method: "PRINCE2", scope: "Software", level: "Project", type: "Mgmt" },
    { id: "t6",  name: "Draft Cost and Benefit Analysis", method: "PRINCE2", scope: "Software", level: "Project", type: "Mgmt" },

    // Governance Setup Summary (s3)
    { id: "t7",  name: "Define Governance Structure", method: "Generic", scope: "Software", level: "Project", type: "Mgmt" },
    { id: "t8",  name: "Set Up Issue and Risk Logs", method: "Generic", scope: "Software", level: "Project", type: "Mgmt" },
    { id: "t9",  name: "Assign Governance Roles", method: "Generic", scope: "Software", level: "Project", type: "Mgmt" },

    // Programme Mobilisation Summary (s4)
    { id: "t10", name: "Define Programme Vision", method: "MSP", scope: "Transformation", level: "Programme", type: "Mgmt" },
    { id: "t11", name: "Develop Programme Mandate", method: "MSP", scope: "Transformation", level: "Programme", type: "Mgmt" },
    { id: "t12", name: "Establish Mobilisation Team", method: "MSP", scope: "Transformation", level: "Programme", type: "Mgmt" },

    // Vision and Blueprinting Summary (s5)
    { id: "t13", name: "Draft High Level Blueprint", method: "MSP", scope: "Transformation", level: "Programme", type: "Mgmt" },
    { id: "t14", name: "Define Target Operating Model", method: "MSP", scope: "Transformation", level: "Programme", type: "Mgmt" },
    { id: "t15", name: "Conduct Programme Readiness Assessment", method: "MSP", scope: "Transformation", level: "Programme", type: "Mgmt" },

    // Benefits Strategy Summary (s6)
    { id: "t16", name: "Define Benefits Strategy", method: "MSP", scope: "Transformation", level: "Programme", type: "Mgmt" },
    { id: "t17", name: "Identify Benefit Owners", method: "MSP", scope: "Transformation", level: "Programme", type: "Mgmt" },
    { id: "t18", name: "Define Measurement Framework", method: "MSP", scope: "Transformation", level: "Programme", type: "Mgmt" },

    // Risk Management Summary (s7)
    { id: "t19", name: "Identify Initial Risks", method: "Generic", scope: "Software", level: "Project", type: "Mgmt" },
    { id: "t20", name: "Define Probability and Impact Scales", method: "Generic", scope: "Software", level: "Project", type: "Mgmt" },
    { id: "t21", name: "Draft Risk Management Approach", method: "Generic", scope: "Software", level: "Project", type: "Mgmt" },

    // Quality Control Summary (s8)
    { id: "t22", name: "Define Quality Criteria", method: "Generic", scope: "Software", level: "Project", type: "Mgmt" },
    { id: "t23", name: "Establish Quality Control Activities", method: "Generic", scope: "Software", level: "Project", type: "Mgmt" },
    { id: "t24", name: "Define Acceptance Standards", method: "Generic", scope: "Software", level: "Project", type: "Mgmt" },

    // Issue Management Summary (s9)
    { id: "t25", name: "Document Initial Issues", method: "Generic", scope: "Software", level: "Project", type: "Mgmt" },
    { id: "t26", name: "Define Issue Escalation Path", method: "Generic", scope: "Software", level: "Project", type: "Mgmt" },
    { id: "t27", name: "Assign Issue Owners", method: "Generic", scope: "Software", level: "Project", type: "Mgmt" },

    // Change Control Summary (s10)
    { id: "t28", name: "Define Change Control Approach", method: "Generic", scope: "Software", level: "Project", type: "Mgmt" },
    { id: "t29", name: "Set Up Change Register", method: "Generic", scope: "Software", level: "Project", type: "Mgmt" },
    { id: "t30", name: "Assess Initial Change Requests", method: "Generic", scope: "Software", level: "Project", type: "Mgmt" },

    // Transition Planning Summary (s11)
    { id: "t31", name: "Develop Transition Roadmap", method: "MSP", scope: "Transformation", level: "Programme", type: "Mgmt" },
    { id: "t32", name: "Define Handover Approach", method: "MSP", scope: "Transformation", level: "Programme", type: "Mgmt" },
    { id: "t33", name: "Conduct Readiness Review", method: "MSP", scope: "Transformation", level: "Programme", type: "Mgmt" },

    // Programme Delivery Summary (s12)
    { id: "t34", name: "Define Delivery Controls", method: "MSP", scope: "Transformation", level: "Programme", type: "Mgmt" },
    { id: "t35", name: "Establish Workstream Reporting", method: "MSP", scope: "Transformation", level: "Programme", type: "Mgmt" },
    { id: "t36", name: "Set Up Programme KPIs", method: "MSP", scope: "Transformation", level: "Programme", type: "Mgmt" }
  ],

  /* ================================================================
     BUNDLES (4 Items - bundles do NOT contain tasks)
     ================================================================ */
  bundles: [
    {
      id: "b1",
      name: "Project Startup Pack",
      method: "PRINCE2",
      scope: "Software",
      level: "Project",
      type: "Mgmt",
      summaries: ["s1", "s2", "s3"],
      tasks: []
    },
    {
      id: "b2",
      name: "Programme Mobilisation Pack",
      method: "MSP",
      scope: "Transformation",
      level: "Programme",
      type: "Mgmt",
      summaries: ["s4", "s5", "s6"],
      tasks: []
    },
    {
      id: "b3",
      name: "Delivery Controls Pack",
      method: "Generic",
      scope: "Software",
      level: "Project",
      type: "Mgmt",
      summaries: ["s7", "s8", "s9"],
      tasks: []
    },
    {
      id: "b4",
      name: "Change and Transition Pack",
      method: "Generic",
      scope: "Transformation",
      level: "Programme",
      type: "Mgmt",
      summaries: ["s10", "s11", "s12"],
      tasks: []
    }
  ]
};
