// @ts-nocheck
/*
=====================================================================
METRA — PersonnelRecordModal.jsx
Stage 404 — Personnel Record Surface (Read-Only)
Stage 405 — Stabilisation + Safe Registry Merge
Stage 406A — Edit Mode Toggle (No Mutation)
Stage 406B — Editable Surface (AddPersonCard Integration)
Stage 407 — Authority Enforcement (Edit Visibility Control)
Stage 500D — Personnel Hub Foundation
Stage 500D-3B — Participation Candidate Selection Path
=====================================================================
*/

import { useState } from "react";
import { createPortal } from "react-dom";
import AddPersonCard from "./AddPersonCard";
import AppointmentsModal from "./AppointmentsModal";
import ManageParticipationModal from "./ManageParticipationModal";
import ExperienceModal from "./ExperienceModal";
import SkillsModal from "./SkillsModal";
import {
  getPersonnel,
  setPersonnel
} from "../domain/personnel/PersonnelRegistry";

export default function PersonnelRecordModal({
  person,
  segments = [],
  tasks = [],
  onClose,
  participationMode = false,
  onSelectPerson = null
}) {
  if (!person) return null;

  const [editing, setEditing] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);
  const [showManageParticipation, setShowManageParticipation] = useState(false);
  const [showExperience, setShowExperience] = useState(false);
  const [showSkills, setShowSkills] = useState(false);

  const registry = Array.isArray(getPersonnel())
    ? getPersonnel()
    : [];

  const registryPerson = registry.find(
    (p) =>
      p.id === person?.id ||
      (p.displayName &&
        p.displayName === person?.displayName) ||
      (p.email &&
        p.email === person?.email)
  );

  const resolvedPerson = registryPerson
    ? { ...person, ...registryPerson }
    : person;

  function handleSave(updatedPerson) {
    const current = Array.isArray(getPersonnel())
      ? getPersonnel()
      : [];

    const updated = current.map((p) =>
      p.id === updatedPerson.id
        ? updatedPerson
        : p
    );

    setPersonnel(updated);
    setEditing(false);
  }

  function handleSelectPerson() {
    if (typeof onSelectPerson === "function") {
      onSelectPerson(resolvedPerson);
    }
  }

  return createPortal(
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 1000002,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            width: "420px",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <strong>Personnel Record</strong>

          {!editing && (
            <div style={{ marginTop: "10px" }}>
              <div>
                <strong>Identity</strong>
              </div>

              <div>
                <strong>Name:</strong>{" "}
                {resolvedPerson.displayName}
              </div>

              {resolvedPerson.department && (
                <div>
                  <strong>Department:</strong>{" "}
                  {resolvedPerson.department}
                </div>
              )}

              {resolvedPerson.organisation && (
                <div>
                  <strong>Organisation:</strong>{" "}
                  {resolvedPerson.organisation}
                </div>
              )}

              {resolvedPerson.email && (
                <div>
                  <strong>Email:</strong>{" "}
                  {resolvedPerson.email}
                </div>
              )}

              {resolvedPerson.phone && (
                <div>
                  <strong>Phone:</strong>{" "}
                  {resolvedPerson.phone}
                </div>
              )}

              <hr style={{ margin: "12px 0" }} />

              <div>
                <strong>Authority</strong>
              </div>

              <div>
                <strong>Authority Level:</strong>{" "}
                {resolvedPerson.authorityLevel || "NONE"}
              </div>

              <hr style={{ margin: "12px 0" }} />

              <div>
                <strong>Appointments</strong>
              </div>
              <button
                type="button"
                onClick={() => setShowAppointments(true)}
                style={{ marginTop: "8px" }}
              >
                View
              </button>

              <hr style={{ margin: "12px 0" }} />

              <div>
                <strong>Experience</strong>
              </div>

              <div style={{ marginTop: "6px" }}>
                No experience recorded
              </div>

              <button
                type="button"
                onClick={() => setShowExperience(true)}
                style={{ marginTop: "8px" }}
              >
                Open
              </button>

              <hr style={{ margin: "12px 0" }} />

              <div>
                <strong>Skills</strong>
              </div>

              <div style={{ marginTop: "6px" }}>
                No skills recorded
              </div>

              <button
                type="button"
                onClick={() => setShowSkills(true)}
                style={{ marginTop: "8px" }}
              >
                Open
              </button>
            </div>
          )}

          {editing && (
            <div style={{ marginTop: "10px" }}>
              <AddPersonCard
                initialData={resolvedPerson}
                onSave={handleSave}
                onCancel={() => setEditing(false)}
              />
            </div>
          )}

          <div
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              {participationMode && !editing && (
                <button onClick={handleSelectPerson}>
                  Select
                </button>
              )}
            </div>

            <div>
                {participationMode && !editing && (
                <button
                  onClick={() => setEditing(true)}
                >
                  Edit
                </button>
              )}

              {editing && (
                <button
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              )}

              <button
                onClick={onClose}
                style={{ marginLeft: "8px" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAppointments && (
        <AppointmentsModal
          person={resolvedPerson}
          segments={segments}
                tasks={tasks}
          allowManage={participationMode}
          onManage={() =>
            setShowManageParticipation(true)
          }
          onClose={() =>
            setShowAppointments(false)
          }
        />
      )}


      {showManageParticipation && (
        <ManageParticipationModal
          person={resolvedPerson}
          segments={segments}
          onClose={() =>
            setShowManageParticipation(false)
          }
        />
      )}

      {showExperience && (
        <ExperienceModal
          person={resolvedPerson}
          onClose={() =>
            setShowExperience(false)
          }
        />
      )}

      {showSkills && (
        <SkillsModal
          person={resolvedPerson}
          onClose={() =>
            setShowSkills(false)
          }
        />
      )}
    </>,
    document.body
  );
}
