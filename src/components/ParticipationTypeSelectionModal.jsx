// @ts-nocheck

import { useState } from "react";
import { createPortal } from "react-dom";
import PARTICIPATION_TYPES from "../domain/personnel/PersonnelParticipationTypes";

const OPTIONS = [
  PARTICIPATION_TYPES.ADMIN,
  PARTICIPATION_TYPES.RISK_INSPECTION,
  PARTICIPATION_TYPES.ISSUE_INSPECTION,
  PARTICIPATION_TYPES.QC_INSPECTION,
  PARTICIPATION_TYPES.CC_INSPECTION,
  PARTICIPATION_TYPES.ESCALATION_INSPECTION
];

export default function ParticipationTypeSelectionModal({
  onSelect,
  onClose
}) {
  const [selectedType, setSelectedType] = useState(null);

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 1000003,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "420px",
          padding: "20px",
          borderRadius: "8px"
        }}
      >
        <strong>Select Participation Type</strong>

        <div style={{ marginTop: "12px" }}>
          {OPTIONS.map((type) => (
            <div key={type} style={{ marginBottom: "8px" }}>
              <button
                onClick={() => setSelectedType(type)}
                style={{
                  width: "100%",
                  background:
                    selectedType === type
                      ? "#dbeafe"
                      : "#fff",
                  border:
                    selectedType === type
                      ? "2px solid #2563eb"
                      : "1px solid #ccc",
                  fontWeight:
                    selectedType === type
                      ? "bold"
                      : "normal"
                }}
              >
                {type}
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "16px" }}>
          <button
            disabled={!selectedType}
            onClick={() => onSelect(selectedType)}
          >
            Confirm
          </button>
        </div>

        <div style={{ marginTop: "16px" }}>
          <button onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
