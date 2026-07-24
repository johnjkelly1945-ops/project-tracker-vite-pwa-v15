// @ts-nocheck

import { useState } from "react";
import { createPortal } from "react-dom";

import {
  resolvePersonnelParticipation
} from "../domain/personnel/PersonnelParticipationResolver";

import {
  repoRemoveParticipation
} from "../domain/personnel/SegmentPersonnelRepository";

export default function ManageParticipationModal({
  person,
  segments = [],
  onClose
}) {
  if (!person) return null;

  const participation =
    resolvePersonnelParticipation(
      person,
      segments
    );

  const [selected, setSelected] =
    useState(null);

  function handleRemove() {
    if (!selected) return;

    repoRemoveParticipation(
      selected.segmentId,
      selected.personId,
      selected.participationType
    );

    onClose?.();
  }

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 1000004,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "650px",
          maxHeight: "80vh",
          overflowY: "auto",
          padding: "20px",
          borderRadius: "8px"
        }}
      >
        <strong>Manage Participation</strong>

        <div style={{ marginTop: "12px" }}>
          {participation.length === 0 ? (
            <div>
              No participation records.
            </div>
          ) : (
            participation.map((item, idx) => (
              <div
                key={idx}
                  onClick={() =>
                    setSelected(item)
                  }
                style={{
                  padding: "8px",
                  marginTop: "6px",
                  border:
                    selected?.appointmentId ===
                    item.appointmentId
                      ? "2px solid #2563eb"
                      : "1px solid #ddd",
                  cursor: "pointer"
                }}
              >
                <div>
                  <strong>
                    {item.segmentName}
                  </strong>
                </div>

                <div>
                  {item.responsibility}
                </div>

                <div>
                  Started:{" "}
                  {new Date(
                    item.appointedAt
                  ).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    }
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div
          style={{
            marginTop: "16px",
            textAlign: "right"
          }}
        >
          <button
            disabled={!selected}
            onClick={handleRemove}
          >
            Remove Participation
          </button>

          <button
            onClick={onClose}
            style={{
              marginLeft: "8px"
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
