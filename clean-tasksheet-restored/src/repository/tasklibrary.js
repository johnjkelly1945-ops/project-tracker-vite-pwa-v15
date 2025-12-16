/* ======================================================================
   METRA – Repository Task Library
   Canonical Repository Data Source (Stage 8 Foundation)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Single source of truth for repository content
   ✔ Used by RepositoryOverlay → Sandbox
   ✔ Read-only from workspace perspective
   ✔ Supports bundles → summaries → tasks
   ✔ Scalable for versioning, filtering, persistence later
   ====================================================================== */

export const taskLibrary = {
  bundles: [
    {
      id: "bundle-feasibility",
      title: "Feasibility",

      summaries: [
        {
          id: "summary-feasibility-overview",
          title: "Feasibility Overview",

          tasks: [
            {
              id: "task-identify-options",
              title: "Identify options"
            },
            {
              id: "task-identify-constraints",
              title: "Identify constraints"
            }
          ]
        },

        {
          id: "summary-feasibility-analysis",
          title: "Feasibility Analysis",

          tasks: [
            {
              id: "task-cost-benefit",
              title: "Cost / benefit analysis"
            }
          ]
        }
      ]
    },

    {
      id: "bundle-business-case",
      title: "Business Case",

      summaries: [
        {
          id: "summary-business-case-outline",
          title: "Business Case Outline",

          tasks: [
            {
              id: "task-define-objectives",
              title: "Define objectives"
            },
            {
              id: "task-identify-stakeholders",
              title: "Identify stakeholders"
            }
          ]
        }
      ]
    }
  ]
};
