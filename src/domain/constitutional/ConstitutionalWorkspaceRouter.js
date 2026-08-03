// @ts-nocheck
/*
======================================================================

METRA — ConstitutionalWorkspaceRouter.js
Stage 500L-3A — Constitutional Router Semantic Alignment

PURPOSE
-------
Determine the Constitutional Workspace required to
discharge a Constitutional Responsibility.

The selected Constitutional Responsibility is the
constitutional entry point for workspace routing.

CONSTITUTIONAL RULES
--------------------
• Repository remains the single source of truth.
• Constitutional Engagement Resolver owns engagement aggregation.
• Constitutional Router owns constitutional destination routing.
• Router performs routing determination only.
• Router performs no mutation.
• Router performs no rendering.
• Router performs no UI navigation.
• Router returns constitutional destinations only.

======================================================================
*/

import { resolveOperationalAuthority }
  from "../operation/OperationalAuthorityResolver";

import { resolveAdvisoryNavigation }
  from "../governance/AdvisoryNavigationResolver";

export const CONSTITUTIONAL_WORKSPACE = Object.freeze({
  TASK: "TASK",
  ADVISORY: "ADVISORY",
  GOVERNANCE: "GOVERNANCE",
    CC: "CC",
    RISK: "RISK",
    ISSUE: "ISSUE",
    QC: "QC",
  OWNERSHIP: "OWNERSHIP",
  BOARD: "BOARD",
  PARTICIPATION: "PARTICIPATION"
});

export function resolveConstitutionalWorkspace({
  constitutionalEngagement,
  actor,
  segment,
  task
}) {
  /*
  ==========================================================

  CONSTITUTIONAL ENGAGEMENT

  Constitutional Engagement represents the Constitutional
  Responsibility being discharged.

  The router accepts Constitutional Engagement as its
  constitutional routing input.

  During Stage 500N the router progressively transitions
  from repository-derived routing toward engagement-derived
  routing while preserving constitutional behaviour.

  ==========================================================
  */
  console.log("STAGE500T ROUTER INPUT", {
  constitutionalEngagement,
  actor,
  segment: segment?.id,
  task: task?.id
});

const { isOperational } =
    resolveOperationalAuthority({
        engagement: constitutionalEngagement,
      actor,
      segment,
      task
    });

  const advisoryNavigation =
    resolveAdvisoryNavigation({
      actor,
      taskId: task?.id
    });

  const hasAdvisoryWorkspace =
    advisoryNavigation.length > 0;

  console.log("STAGE500T ROUTER", {
    constitutionalEngagement,
    isOperational,
    hasAdvisoryWorkspace,
    taskId: task?.id
  });


  if (constitutionalEngagement?.responsibility === "CC_INSPECTION") {
    console.log("STAGE500T ROUTER -> CC");
    return {
      destination:
        CONSTITUTIONAL_WORKSPACE.CC
    };
  }


    if (constitutionalEngagement?.responsibility === "Advisory" &&
        constitutionalEngagement?.governanceEventType) {

      switch (constitutionalEngagement.governanceEventType) {

        case "CC":
          return {
            destination: CONSTITUTIONAL_WORKSPACE.CC
          };

        case "RISK":
          return {
            destination: CONSTITUTIONAL_WORKSPACE.RISK
          };

        case "ISSUE":
          return {
            destination: CONSTITUTIONAL_WORKSPACE.ISSUE
          };

        case "QC":
          return {
            destination: CONSTITUTIONAL_WORKSPACE.QC
          };

        default:
          break;
      }
    }

  if (constitutionalEngagement?.responsibility === "Advisory") {
    return {
      destination:
        CONSTITUTIONAL_WORKSPACE.ADVISORY
    };
  }
  if (isOperational) {
    return {
      destination:
        CONSTITUTIONAL_WORKSPACE.TASK
    };
  }


  if (constitutionalEngagement?.responsibility === "CC_INSPECTION") {
    console.log("STAGE500T ROUTER -> CC");
    return {
      destination:
        CONSTITUTIONAL_WORKSPACE.CC
    };
  }




  if (constitutionalEngagement?.responsibility === "RISK_INSPECTION") {
    console.log("STAGE500T ROUTER -> RISK");
      return {
        destination:
          CONSTITUTIONAL_WORKSPACE.RISK
    };
  }


    if (constitutionalEngagement?.responsibility === "QC_INSPECTION") {
      console.log("STAGE500T ROUTER -> QC");
      return {
        destination:
          CONSTITUTIONAL_WORKSPACE.QC
      };
    }

    if (constitutionalEngagement?.responsibility === "ISSUE_INSPECTION") {
      console.log("STAGE500T ROUTER -> ISSUE");
      return {
        destination:
          CONSTITUTIONAL_WORKSPACE.ISSUE
      };
    }

  return {
    destination:
      CONSTITUTIONAL_WORKSPACE.TASK
  };
}

export default resolveConstitutionalWorkspace;
