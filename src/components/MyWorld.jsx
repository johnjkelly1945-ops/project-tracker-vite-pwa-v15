// @ts-nocheck
/*
======================================================================

METRA — MyWorld.jsx
Stage 500L-4C — My METRA World Presentation

PURPOSE
-------

Presentation-only constitutional destination.

No Repository.
No actor projection.
No routing.
No behavioural logic.

======================================================================
*/


import ActingActorSelector from "./ActingActorSelector";
import { getActingUser } from "../domain/actor/ActingUser";
export default function MyWorld({
  open,
  onClose,
  responsibilityProjection,
  onSelectResponsibility
}) {


  const actor = getActingUser();
  if (!open) {
    return null;
  }

  return (
    <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#ffffff",
          overflowY: "auto",
          zIndex: 1000000
        }}
    >
      <div
        style={{
          maxWidth: "760px",
          margin: "40px auto 80px auto",
          background: "#ffffff",
          borderRadius: "20px",
          overflow: "hidden"
        }}
      >

        <div
          style={{
            background: "#1d4f91",
            color: "#ffffff",
            textAlign: "center",
            padding: "22px",
            fontSize: "28px",
            fontWeight: "700",
            letterSpacing: "1px"
          }}
        >
          MY METRA WORLD
        </div>

        <div style={{ padding: "40px" }}>
            <ActingActorSelector />


          <div
            style={{
              fontSize: "28px",
              marginBottom: "14px"
            }}
          >
            Welcome {actor?.displayName || "User"}.
          </div>

          <div
            style={{
              fontSize: "18px",
              color: "#444",
              marginBottom: "48px"
            }}
          >
            Today these are your responsibilities in METRA.
          </div>

          {(responsibilityProjection || []).map((item, index) => (
            <div
              key={index}
              onClick={() => onSelectResponsibility?.(item)}
              style={{
                marginBottom: "36px",
                cursor: "pointer"
              }}
            >
              <div style={{ fontWeight: "600", fontSize: "22px" }}>
                {item.segmentName}
              </div>

              <div style={{ marginTop: "6px" }}>
                {item.responsibility}
              </div>

              <div
                style={{
                  marginTop: "8px",
                  fontSize: "14px",
                  color: "#777"
                }}
              >
                {item.appointedAt}
              </div>
            </div>
          ))}

          <div style={{ marginTop: "56px" }}>

            <div style={{ marginBottom: "20px" }}>
              Learn how METRA works
            </div>

            <div>
              About METRA
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
