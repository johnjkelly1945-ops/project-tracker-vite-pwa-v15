// @ts-nocheck
/*
=====================================================================
METRA — SubordinateSelectionModal.jsx
Stage 398 — Modal-contained Personnel Interaction (Extension)
Stage 405B — Personnel Record Inspection (Additive View Control)
=====================================================================
*/

import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import AddPersonCard from "./AddPersonCard";
import PersonnelRecordModal from "./PersonnelRecordModal";
import { getPersonnel, setPersonnel } from "../domain/personnel/PersonnelRegistry";

function normalizeItem(item, index) {
  if (typeof item === "string") {
    return {
      id: `seed-${index}-${item}`,
      displayName: item,
      title: item,
    };
  }

  if (!item || typeof item !== "object") {
    return {
      id: `seed-${index}-unknown`,
      displayName: String(item),
      title: String(item),
    };
  }

  const derivedName =
    item.displayName ||
    item.title ||
    item.name ||
    item.email ||
    `Item ${index + 1}`;

  return {
    ...item,
    id: item.id || `seed-${index}-${derivedName}`,
    displayName: item.displayName || item.title || item.name || derivedName,
    title: item.title || item.displayName || item.name || derivedName,
  };
}

function makePersonKey(item) {
  if (!item) return "unknown";
  return [
    item.id || "",
    item.displayName || "",
    item.email || "",
    item.phone || "",
  ].join("|");
}

export default function SubordinateSelectionModal({
  title = "Select Item",
  items = [],
  onSelect,
  onClose,
}) {
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const [viewPerson, setViewPerson] = useState(null);

  function handleAddPerson(person) {
    const current = Array.isArray(getPersonnel()) ? getPersonnel() : [];
    const updated = [...current, person];
    setPersonnel(updated);
    setShowAddPerson(false);
    setRefreshTick((n) => n + 1);
  }

  function handleViewPerson(person) {
    setViewPerson(person);
  }

  const visibleItems = useMemo(() => {
    const seeded = Array.isArray(items) ? items.map(normalizeItem) : [];
    const registry = Array.isArray(getPersonnel())
      ? getPersonnel().map(normalizeItem)
      : [];

    const merged = [...seeded, ...registry];
    const seen = new Set();

    return merged.filter((item) => {
      const key = makePersonKey(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [items, refreshTick]);

  return createPortal(
    <div
      className="subordinate-modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 11000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="subordinate-modal-window"
        style={{
          background: "#ffffff",
          borderRadius: "8px",
          width: "420px",
          maxWidth: "90vw",
          maxHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
        }}
      >
        <div
          className="subordinate-modal-header"
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #ddd",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 600,
          }}
        >
          <span>{title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close selection modal"
            style={{
              border: "none",
              background: "transparent",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <div
          className="subordinate-modal-body"
          style={{
            padding: "12px",
            overflowY: "auto",
          }}
        >
          {showAddPerson ? (
            <AddPersonCard
              onSave={handleAddPerson}
              onCancel={() => setShowAddPerson(false)}
            />
          ) : (
            <>
              {visibleItems.length === 0 && (
                <div
                  className="subordinate-modal-empty"
                  style={{ color: "#666", fontStyle: "italic" }}
                >
                  No items available
                </div>
              )}

              {visibleItems.map((item) => (
                <div
                  key={item.id}
                  className="subordinate-modal-item"
                  onClick={() => onSelect(item)}
                  style={{
                    padding: "8px 10px",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontWeight: 500 }}>
                    {item.displayName || item.title || String(item)}
                  </div>

                  {(item.role || item.department || item.organisationType) && (
                    <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                      {[item.role, item.department, item.organisationType]
                        .filter(Boolean)
                        .join(" • ")}
                    </div>
                  )}

                  {(item.email || item.phone) && (
                    <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                      {[item.email, item.phone].filter(Boolean).join(" • ")}
                    </div>
                  )}

                  <div
                    style={{ fontSize: "12px", color: "#888", cursor: "pointer", marginTop: "4px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewPerson(item);
                    }}
                  >
                    View
                  </div>
                </div>
              ))}

              <div style={{ marginTop: "12px" }}>
                <button type="button" onClick={() => setShowAddPerson(true)}>
                  + Add Person
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {viewPerson && (
        <PersonnelRecordModal
          person={viewPerson}
          onClose={() => setViewPerson(null)}
        />
      )}
    </div>,
    document.body
  );
}
