/* ======================================================================
   METRA – bundleLibrary.js
   ----------------------------------------------------------------------
   Defines structured bundles of tasks for quick project setup.
   Each bundle maps to a METHOD and PROJECT TYPE.
   Bundles contain ordered arrays of TASK IDs found in taskLibrary.
   ====================================================================== */

import { managementTasks, developmentTasks } from "./taskLibrary";

/* ======================================================================
   HELPER: extract task IDs by name
   ----------------------------------------------------------------------
   Allows bundles to reference tasks cleanly by name instead of by ID.
   ====================================================================== */

function findTaskId(tasks, name) {
  const t = tasks.find((x) => x.name === name);
  return t ? t.id : null;
}

/* ======================================================================
   BUNDLES – defined by METHOD and PROJECT TYPE
   ====================================================================== */

export const bundleLibrary = {
  /* -------------------------------------------------------------------
     PRINCE2 – PROJECT STARTUP BUNDLE
     ------------------------------------------------------------------- */
  "PRINCE2 Project Startup": {
    method: "PRINCE2",
    projectType: "Generic Management",
    tasks: [
      findTaskId(managementTasks["PRINCE2"], "Business Case"),
      findTaskId(managementTasks["PRINCE2"], "Project Brief"),
      findTaskId(managementTasks["PRINCE2"], "Project Initiation Document (PID)"),
      findTaskId(managementTasks["PRINCE2"], "Risk Register"),
      findTaskId(managementTasks["PRINCE2"], "Lessons Log")
    ].filter(Boolean)
  },

  /* -------------------------------------------------------------------
     PMBOK – INITIATION BUNDLE
     ------------------------------------------------------------------- */
  "PMBOK Initiation": {
    method: "PMBOK",
    projectType: "Generic Management",
    tasks: [
      findTaskId(managementTasks["PMBOK"], "Project Charter"),
      findTaskId(managementTasks["PMBOK"], "Stakeholder Register"),
      findTaskId(managementTasks["PMBOK"], "Communications Plan")
    ].filter(Boolean)
  },

  /* -------------------------------------------------------------------
     AGILE – PLANNING BUNDLE
     ------------------------------------------------------------------- */
  "Agile Planning": {
    method: "Agile",
    projectType: "Generic Management",
    tasks: [
      findTaskId(managementTasks["Agile"], "Product Vision"),
      findTaskId(managementTasks["Agile"], "Product Backlog Structure"),
      findTaskId(managementTasks["Agile"], "Sprint Planning Checklist")
    ].filter(Boolean)
  },

  /* -------------------------------------------------------------------
     GENERIC MANAGEMENT – PROJECT SETUP
     ------------------------------------------------------------------- */
  "Generic Management Setup": {
    method: "Generic Management",
    projectType: "Generic Management",
    tasks: [
      findTaskId(managementTasks["Generic Management"], "Meeting Agenda"),
      findTaskId(managementTasks["Generic Management"], "Issue Log"),
      findTaskId(managementTasks["Generic Management"], "Decision Record"),
      findTaskId(managementTasks["Generic Management"], "High-Level Requirements Sheet")
    ].filter(Boolean)
  },

  /* -------------------------------------------------------------------
     GENERIC DEVELOPMENT – TECHNICAL FOUNDATION
     ------------------------------------------------------------------- */
  "Generic Development Setup": {
    method: "Generic Development",
    projectType: "Generic Development",
    tasks: [
      findTaskId(developmentTasks["Generic Development"], "Task Breakdown Sheet"),
      findTaskId(developmentTasks["Generic Development"], "Acceptance Criteria Checklist"),
      findTaskId(developmentTasks["Generic Development"], "Test Summary Sheet")
    ].filter(Boolean)
  }
};
