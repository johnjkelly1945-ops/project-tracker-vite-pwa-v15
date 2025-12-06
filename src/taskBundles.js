/* ======================================================================
   METRA – taskBundles.js
   Framework for Method + Project Type Aware Bundles
   ----------------------------------------------------------------------
   • Bundles vary by:
       - Method (PRINCE2, PMBOK, Agile, MSP, Generic Mgmt, Generic Dev)
       - Project Type (Software, Construction, etc.)
   • Each bundle contains a list of items:
       - type: "summary" | "task"
       - name: string
       - pane: "management" | "development"  (tasks only)
       - category: string (task type for template filtering)
   • METRA selects the correct bundle version when user chooses:
       - method
       - project type
   ====================================================================== */

export const bundles = {
  /* ====================================================================
     PROJECT START-UP BUNDLE (placeholder structure)
     --------------------------------------------------------------------
     Each bundle contains:
       name: Display name
       versions: {
         MethodName: {
           ProjectType: {
             items: [ ... ]
           }
         }
       }
     ==================================================================== */

  "project-startup": {
    name: "Project Start-Up",

    // Framework for methods (content added in Part 2)
    versions: {
      PRINCE2: {
  "Software Development": {
    items: [
      { type: "summary", name: "Mandate Review" },
      { type: "summary", name: "Project Brief Overview" },
      { type: "summary", name: "Business Case Development" },
      { type: "summary", name: "Initial Risk Identification" },
      { type: "summary", name: "Stakeholder Considerations" },
      { type: "summary", name: "Delivery Approach Overview" },

      { type: "task", pane: "management", category: "business", name: "Clarify Project Mandate" },
      { type: "task", pane: "management", category: "business", name: "Draft Project Brief" },
      { type: "task", pane: "management", category: "business", name: "Develop Outline Business Case" },
      { type: "task", pane: "management", category: "risk", name: "Identify Initial Risks" },
      { type: "task", pane: "management", category: "planning", name: "Identify Initial Stakeholders" },
      { type: "task", pane: "management", category: "planning", name: "Define Project Approach" },

      { type: "task", pane: "development", category: "technical", name: "Define High-Level Requirements" },
      { type: "task", pane: "development", category: "technical", name: "Identify Technical Constraints" }
    ]
  },

  Construction: {
    items: [
      { type: "summary", name: "Mandate Review" },
      { type: "summary", name: "Project Brief Overview" },
      { type: "summary", name: "Business Case Development" },
      { type: "summary", name: "Site Considerations Summary" },
      { type: "summary", name: "Initial Risk Identification" },

      { type: "task", pane: "management", category: "business", name: "Clarify Project Mandate" },
      { type: "task", pane: "management", category: "business", name: "Draft Project Brief" },
      { type: "task", pane: "management", category: "business", name: "Develop Outline Business Case" },
      { type: "task", pane: "management", category: "risk", name: "Identify Initial Risks" },

      { type: "task", pane: "development", category: "technical", name: "Define Site Requirements" },
      { type: "task", pane: "development", category: "technical", name: "Identify Construction Constraints" },
      { type: "task", pane: "development", category: "operations", name: "Prepare Initial Method Statement" }
    ]
  },

  Relocation: {
    items: [
      { type: "summary", name: "Mandate Review" },
      { type: "summary", name: "Move Strategy Overview" },
      { type: "summary", name: "Business Case Development" },
      { type: "summary", name: "Initial Risk Identification" },

      { type: "task", pane: "management", category: "business", name: "Clarify Move Mandate" },
      { type: "task", pane: "management", category: "business", name: "Draft Move Brief" },
      { type: "task", pane: "management", category: "risk", name: "Identify Move Risks" },

      { type: "task", pane: "development", category: "technical", name: "Assess Equipment Inventory Impacts" },
      { type: "task", pane: "development", category: "operations", name: "Identify Move Logistics Constraints" }
    ]
  },

  Operations: {
    items: [
      { type: "summary", name: "Mandate Review" },
      { type: "summary", name: "Operational Brief Overview" },
      { type: "summary", name: "Business Case Development" },

      { type: "task", pane: "management", category: "business", name: "Clarify Operational Mandate" },
      { type: "task", pane: "management", category: "business", name: "Draft Operational Brief" },
      { type: "task", pane: "management", category: "risk", name: "Identify Operational Risks" },

      { type: "task", pane: "development", category: "operations", name: "Define SOP Requirements" },
      { type: "task", pane: "development", category: "operations", name: "Identify Operational Constraints" }
    ]
  },

  "Business Transformation": {
    items: [
      { type: "summary", name: "Mandate Review" },
      { type: "summary", name: "Capability Assessment Summary" },
      { type: "summary", name: "Business Case Development" },

      { type: "task", pane: "management", category: "business", name: "Clarify Transformation Mandate" },
      { type: "task", pane: "management", category: "business", name: "Draft Transformation Brief" },
      { type:="task", pane:"management", category:"risk", name:"Identify Transformation Risks" },

      { type: "task", pane: "development", category: "technical", name: "Assess Current Capabilities" },
      { type: "task", pane: "development", category: "technical", name: "Identify Technical Change Constraints" }
    ]
  },

  "Generic Development": {
    items: [
      { type: "summary", name: "Mandate Review" },
      { type: "summary", name: "Project Brief Overview" },

      { type: "task", pane: "management", category: "business", name: "Clarify Project Mandate" },
      { type: "task", pane: "management", category: "risk", name: "Identify Initial Risks" },

      { type: "task", pane: "development", category: "technical", name: "Define Requirements" },
      { type: "task", pane: "development", category: "technical", name: "Identify Constraints" }
    ]
  },

  "Generic Management": {
    items: [
      { type: "summary", name: "Mandate Review" },
      { type: "summary", name: "Project Brief Overview" },

      { type: "task", pane: "management", category: "business", name: "Draft Project Brief" },
      { type: "task", pane: "management", category: "risk", name: "Identify Initial Risks" }
    ]
  }
},


      PMBOK: {
        "Software Development": { items: [] },
        Construction: { items: [] },
        Relocation: { items: [] },
        Operations: { items: [] },
        "Business Transformation": { items: [] },
        "Generic Development": { items: [] },
        "Generic Management": { items: [] }
      },

      Agile: {
        "Software Development": { items: [] },
        Construction: { items: [] },
        Relocation: { items: [] },
        Operations: { items: [] },
        "Business Transformation": { items: [] },
        "Generic Development": { items: [] },
        "Generic Management": { items: [] }
      },

      MSP: {
        "Software Development": { items: [] },
        Construction: { items: [] },
        Relocation: { items: [] },
        Operations: { items: [] },
        "Business Transformation": { items: [] },
        "Generic Development": { items: [] },
        "Generic Management": { items: [] }
      },

      "Generic Management": {
        "Software Development": { items: [] },
        Construction: { items: [] },
        Relocation: { items: [] },
        Operations: { items: [] },
        "Business Transformation": { items: [] },
        "Generic Development": { items: [] },
        "Generic Management": { items: [] }
      },

      "Generic Development": {
        "Software Development": { items: [] },
        Construction: { items: [] },
        Relocation: { items: [] },
        Operations: { items: [] },
        "Business Transformation": { items: [] },
        "Generic Development": { items: [] },
        "Generic Management": { items: [] }
      }
    }
  }

  // --- More bundles will be added here ---
};


/* ======================================================================
   RESOLVER: Returns the correct bundle version
   ----------------------------------------------------------------------
   Parameters:
     bundleId (e.g., "project-startup")
     method ("PRINCE2", "PMBOK", ...)
     projectType ("Software Development", "Construction", ...)
   ====================================================================== */

export function getBundleVersion(bundleId, method, projectType) {
  const bundle = bundles[bundleId];
  if (!bundle) return null;

  const methodSet = bundle.versions[method];
  if (!methodSet) return null;

  return methodSet[projectType] || null;
}
