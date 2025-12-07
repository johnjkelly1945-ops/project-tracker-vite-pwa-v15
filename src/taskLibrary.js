/* ======================================================================
   METRA – taskLibrary.js
   STRUCTURE ALIGNED WITH NEW TaskRepository.jsx
   ----------------------------------------------------------------------
   • Summaries include: id, name, method, scope, level, tasks[]
   • Tasks include: id, name, method, scope, level, type, category
   • Bundles include: id, name, method, scope, level, summaries[], tasks[]
   • Category used for hierarchical grouping in Pane 2
   • Scope + Type added to support filtering
   ====================================================================== */

export const taskLibrary = {

  /* ================================================================
     SUMMARIES (Structural sections only)
     ================================================================ */
  summaries: [
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
      name: "Governance Summary",
      method: "Generic",
      scope: "Software",
      level: "Project",
      type: "Mgmt",
      tasks: ["t4", "t5"]
    },
    {
      id: "s3",
      name: "Programme Mobilisation Summary",
      method: "MSP",
      scope: "Transformation",
      level: "Programme",
      type: "Mgmt",
      tasks: ["t6", "t7"]
    }
  ],

  /* ================================================================
     TASKS (Hierarchical + Filterable)
     ================================================================ */
  tasks: [
    {
      id: "t1",
      name: "Create Project Brief",
      method: "PRINCE2",
      scope: "Software",
      level: "Project",
      type: "Mgmt",
      category: "Initiation"
    },
    {
      id: "t2",
      name: "Define Approach",
      method: "PRINCE2",
      scope: "Software",
      level: "Project",
      type: "Mgmt",
      category: "Initiation"
    },
    {
      id: "t3",
      name: "Initial Stakeholder Mapping",
      method: "Generic",
      scope: "Software",
      level: "Project",
      type: "Mgmt",
      category: "Initiation"
    },
    {
      id: "t4",
      name: "Set Governance Structure",
      method: "Generic",
      scope: "Software",
      level: "Project",
      type: "Mgmt",
      category: "Governance Setup"
    },
    {
      id: "t5",
      name: "Setup Issue & Risk Logs",
      method: "Generic",
      scope: "Software",
      level: "Project",
      type: "Mgmt",
      category: "Governance Setup"
    },
    {
      id: "t6",
      name: "Define Programme Vision",
      method: "MSP",
      scope: "Transformation",
      level: "Programme",
      type: "Mgmt",
      category: "Programme Definition"
    },
    {
      id: "t7",
      name: "Prepare Programme Blueprint",
      method: "MSP",
      scope: "Transformation",
      level: "Programme",
      type: "Mgmt",
      category: "Programme Definition"
    }
  ],

  /* ================================================================
     BUNDLES (Combination of summaries + tasks)
     ================================================================ */
  bundles: [
    {
      id: "b1",
      name: "Project Startup Pack",
      method: "PRINCE2",
      scope: "Software",
      level: "Project",
      type: "Mgmt",
      summaries: ["s1"],
      tasks: ["t1", "t2", "t3"]
    },
    {
      id: "b2",
      name: "Core Governance Pack",
      method: "Generic",
      scope: "Software",
      level: "Project",
      type: "Mgmt",
      summaries: ["s2"],
      tasks: ["t4", "t5"]
    },
    {
      id: "b3",
      name: "Programme Launch Pack",
      method: "MSP",
      scope: "Transformation",
      level: "Programme",
      type: "Mgmt",
      summaries: ["s3"],
      tasks: ["t6", "t7"]
    }
  ]
};
