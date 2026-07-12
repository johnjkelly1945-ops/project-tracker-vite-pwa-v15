// @ts-nocheck

import { getPersonnel } from "../domain/personnel/PersonnelRegistry";
import {
  setActingUser
} from "../domain/actor/ActingUser";

export default function ActingActorSelector() {

  return (
    <div style={{ marginBottom: "12px" }}>
      <select
        onChange={(e) => {
          const personnel = getPersonnel() || [];
          const selectedId = e.target.value;
          const person = personnel.find(
            p => p.id === selectedId
          );

          if (!person) return;

          setActingUser(person);

          try {
            localStorage.setItem(
              "metra_acting_user",
              JSON.stringify(person)
            );
          } catch (e) {
            console.warn(
              "Failed to persist actor"
            );
          }

          // TEMPORARY ENTRY LIFECYCLE
          // Stage 500 uses a page reload until the
          // constitutional login/session lifecycle
          // is introduced in Stage 501.
          window.location.reload();
        }}
        style={{ width: "100%" }}
      >
        <option value="">
          Select Acting Actor
        </option>

        {(getPersonnel() || []).map(p => (
          <option
            key={p.id}
            value={p.id}
          >
            {p.displayName}
          </option>
        ))}

      </select>
    </div>
  );
}
