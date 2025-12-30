// @ts-nocheck
import { useState } from "react";
import CreateTaskModal from "./CreateTaskModal";

/*
=====================================================================
METRA — PreProjectFooter.jsx
Stage 28 — Step 1
Footer Trigger for Create Task Modal
=====================================================================
*/

export default function PreProjectFooter({
  summaries,
  onCreateTaskIntent,
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div style={{ marginTop: "16px" }}>
        <button onClick={() => setOpen(true)}>Add Task</button>
      </div>

      <CreateTaskModal
        isOpen={open}
        summaries={summaries}
        onCancel={() => setOpen(false)}
        onSubmit={(intent) => {
          onCreateTaskIntent(intent);
          setOpen(false);
        }}
      />
    </>
  );
}
