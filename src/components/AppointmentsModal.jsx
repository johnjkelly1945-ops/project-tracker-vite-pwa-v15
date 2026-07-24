// @ts-nocheck
import { createPortal } from "react-dom";

import { useState } from "react";

import { getPersonnel } from "../domain/personnel/PersonnelRegistry";
import resolveConstitutionalAppointmentProjection
  from "../domain/constitutional/ConstitutionalAppointmentProjectionResolver";
import { resolvePersonnelParticipation } from "../domain/personnel/PersonnelParticipationResolver";

export default function AppointmentsModal({
  person,
  segments = [],
  tasks = [],
  allowManage = false,
  onManage,
  onClose
}) {
  if (!person) return null;

  const registry = Array.isArray(getPersonnel()) ? getPersonnel() : [];

  const registryPerson = registry.find(
    (p) =>
      p.id === person?.id ||
      (p.displayName && p.displayName === person?.displayName) ||
      (p.email && p.email === person?.email)
  );

  const resolvedPerson = registryPerson
    ? { ...person, ...registryPerson }
    : person;

  const appointments =
    resolveConstitutionalAppointmentProjection(
      resolvedPerson,
      segments,
      tasks
    );

  const participation =
    resolvePersonnelParticipation(
      resolvedPerson,
      segments
    );

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 1000003,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "600px",
          maxHeight: "80vh",
          overflowY: "auto",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <strong>Appointments</strong>

        <div style={{ marginTop: "12px" }}>
          <div>
            <strong>Personnel:</strong>{" "}
            {resolvedPerson.displayName || resolvedPerson.title || "Unknown"}
          </div>

          <div style={{ marginTop: "16px" }}>
            <strong>Current Appointments</strong>
          </div>

          <div style={{ marginTop: "12px" }}>
            {appointments.length === 0 ? (
              <div>No participation records.</div>
            ) : (
              appointments.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "6px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div>
                    <strong>{item.segmentName}</strong>
                  </div>

                  <div>
                    <strong>{item.responsibility}</strong>
                  </div>

                  <div>
                    Started: {new Date(item.appointedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div style={{ marginTop: "16px" }}>
          <strong>Current Participation</strong>
        </div>

        <div style={{ marginTop: "12px" }}>
          {participation.length === 0 ? (
            <div>No participation records.</div>
          ) : (
            participation.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: "6px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div>
                  <strong>{item.segmentName}</strong>
                </div>

                <div>
                  <strong>{item.responsibility}</strong>
                </div>

                <div>
                  Started: {new Date(item.appointedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: "16px", textAlign: "right" }}>
          <button onClick={onManage}>
            Manage
          </button>

          <button
            onClick={onClose}
            style={{ marginLeft: "8px" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
