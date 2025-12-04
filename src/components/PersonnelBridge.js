/* ======================================================================
   METRA – PersonnelBridge.js
   v4.6B.14 – Logic Reintegration (Stage 4)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Central point for personnel assignment logic
   ✔ Ensures Management & Development panes behave identically
   ✔ Stateless utility functions (safe, predictable)
   ----------------------------------------------------------------------
   CURRENT BEHAVIOUR (STAGE 4):
   – Simple helper to apply an assigned name to a task object
   – No side effects
   – Not activated until Stage 6 when TaskPopup integrates
   ====================================================================== */

export const PersonnelBridge = {
  assignPerson(task, name) {
    return {
      ...task,
      assigned: name
    };
  }
};
