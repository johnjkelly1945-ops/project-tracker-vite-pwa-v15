/* ======================================================================
   METRA – taskLibrary.js
   FINAL TWO-COLUMN MODEL (Summaries + Tasks)
   ----------------------------------------------------------------------
   Column 1:
     • Summaries (filtered)
     • Bundles (filtered)

   Column 2:
     • Tasks associated with the selected summaries OR selected bundles
     • Tasks can also be selected independently

   Behaviours:
     ✔ No item auto-selects others
     ✔ Bundles reveal their summaries + tasks in UI, but require click to import
     ✔ Filters affect all three structures
   ====================================================================== */

export const taskLibrary = {
  /* ================================================================
     SUMMARIES
     (Column 1 – always expanded, collapsible later if needed)
     ================================================================ */
  summaries: [
    {
      id: "s1",
      name: "Project Initiation Summary",
      description: "Captures the core aims and constraints of the project.",
      method: "PRINCE2",
      projectType: "All",
      level: "Project",
      tasks: ["t1", "t2", "t3"]
    },
    {
      id: "s2",
      name: "Governance Summary",
      description: "Key governance structures, responsibilities, and controls.",
      method: "Generic",
      projectType: "All",
      level: "Project",
      tasks: ["t4", "t5"]
    },
    {
      id: "s3",
      name: "Programme Mobilisation Summary",
      description: "High-level mobilisation steps for programmes.",
      method: "MSP",
      projectType: "All",
      level: "Programme",
      tasks: ["t6", "t7"]
    }
  ],

  /* ================================================================
     TASKS
     (Column 2 – filtered by selected summaries or bundles)
     ================================================================ */
  tasks: [
    {
      id: "t1",
      name: "Create Project Brief",
      description: "Document project purpose, justification, and scope.",
      method: "PRINCE2",
      projectType: "All",
      level: "Project"
    },
    {
      id: "t2",
      name: "Define Approach",
      description: "Outline methods, delivery style, and constraints.",
      method: "PRINCE2",
      projectType: "All",
      level: "Project"
    },
    {
      id: "t3",
      name: "Initial Stakeholder Mapping",
      description: "Identify key stakeholders and influence levels.",
      method: "Generic",
      projectType: "All",
      level: "Project"
    },
    {
      id: "t4",
      name: "Set Governance Structure",
      description: "Define boards, roles, and reporting routes.",
      method: "Generic",
      projectType: "All",
      level: "Project"
    },
    {
      id: "t5",
      name: "Setup Issue & Risk Logs",
      description: "Create tools for capturing issues and risks.",
      method: "Generic",
      projectType: "All",
      level: "Project"
    },
    {
      id: "t6",
      name: "Define Programme Vision",
      description: "Agree long-term MSP vision and intended outcomes.",
      method: "MSP",
      projectType: "All",
      level: "Programme"
    },
    {
      id: "t7",
      name: "Prepare Programme Blueprint",
      description: "Draft future operating model according to MSP.",
      method: "MSP",
      projectType: "Transformation",
      level: "Programme"
    }
  ],

  /* ================================================================
     BUNDLES
     (Column 1 – displayed after Summaries)
     Bundles = predefined combinations of summaries + tasks.
     User must explicitly tick each item they want.
     ================================================================ */
  bundles: [
    {
      id: "b1",
      name: "Project Startup Pack",
      description: "Quick start items for small/medium PRINCE2 projects.",
      method: "PRINCE2",
      projectType: "All",
      level: "Project",
      summaries: ["s1"],
      tasks: ["t1", "t2", "t3"]
    },
    {
      id: "b2",
      name: "Core Governance Pack",
      description: "Ensures PMO-standard governance readiness.",
      method: "Generic",
      projectType: "All",
      level: "Project",
      summaries: ["s2"],
      tasks: ["t4", "t5"]
    },
    {
      id: "b3",
      name: "Programme Launch Pack",
      description: "MSP mobilisation starter pack.",
      method: "MSP",
      projectType: "Transformation",
      level: "Programme",
      summaries: ["s3"],
      tasks: ["t6", "t7"]
    }
  ]
};
