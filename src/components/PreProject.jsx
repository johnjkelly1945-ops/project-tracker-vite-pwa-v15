/* ======================================================================
   METRA – PreProject.jsx
   v7 A13 – AddTask exposed to DualPane + Correct Filters
   ====================================================================== */

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle
} from "react";

import AddItemPopup from "./AddItemPopup.jsx";
import PersonnelOverlay from "./PersonnelOverlay.jsx";
import TaskPopup from "./TaskPopup.jsx";

import "../Styles/PreProject.css";

function PreProjectComponent({ filter, openPopup }, ref) {

  /* ====================================================================
     BASE TASKS
     ==================================================================== */

  const defaultTasks = [
    { id: 1, title: "Prepare Scope Summary", status: "Not Started", person: "", flag: "" },
    { id: 2, title: "Initial Risk Scan", status: "Not Started", person: "", flag: "" },
    { id: 3, title: "Stakeholder Mapping", status: "Not Started", person: "", flag: "" }
  ];

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks_v3");
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  /* ====================================================================
     STATUS AUTO-HEAL
     ==================================================================== */

  useEffect(() => {
    const healed = tasks.map(t =>
      t.person && t.person.trim() !== "" && t.status === "Not Started"
        ? { ...t, status: "In Progress" }
        : t
    );

    if (JSON.stringify(healed) !== JSON.stringify(tasks)) {
      setTasks(healed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks_v3", JSON.stringify(tasks));
  }, [tasks]);


  /* ====================================================================
     PERSONNEL OVERLAY
     ==================================================================== */

  const [showPersonnel, setShowPersonnel] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedTaskForPopup, setSelectedTaskForPopup] = useState(null);

  const openPersonnel = (taskId) => {
    setSelectedTaskId(taskId);
    setShowPersonnel(true);
  };

  const closePersonnel = () => setShowPersonnel(false);

  const handleSelectPerson = (name) => {
    if (!selectedTaskId) return;

    const updated = tasks.map((t) =>
      t.id === selectedTaskId
        ? { ...t, person: name, status: "In Progress" }
        : t
    );

    setTasks(updated);
    closePersonnel();

    const updatedTask = updated.find(t => t.id === selectedTaskId);

    setTimeout(() => {
      setSelectedTaskForPopup(updatedTask);
    }, 0);
  };


  /* ====================================================================
     ADD TASK POPUP
     ==================================================================== */

  const [showAddItem, setShowAddItem] = useState(false);

  const handleAddTask = (taskObj) => {
    const newTask = {
      id: Date.now(),
      title: taskObj.title,
      status: "Not Started",
      person: "",
      flag: ""
    };
    setTasks([...tasks, newTask]);
    setShowAddItem(false);
  };

  /* ====================================================================
     EXPOSE METHOD TO DUALPANE
     ==================================================================== */

  useImperativeHandle(ref, () => ({
    openAddTaskPopup: () => setShowAddItem(true)
  }));


  /* ====================================================================
     FILTERING
     ==================================================================== */

  const filteredTasks = (() => {
    switch (filter) {
      case "notstarted":
        return tasks.filter(t =>
          t.status === "Not Started" && t.flag === ""
        );
      case "inprogress":
        return tasks.filter(t => t.status === "In Progress");
      case "completed":
        return tasks.filter(t => t.status === "Completed");
      case "flagged":
        return tasks.filter(t => t.flag === "red");
      case "open":
        return tasks.filter(t => t.updatedForPM === true);
      default:
        return tasks;
    }
  })();


  /* ====================================================================
     UPDATE TASK
     ==================================================================== */

  const updateTask = (id, fields) => {

    if (fields.changePerson) {
      setSelectedTaskForPopup(null);
      setSelectedTaskId(id);
      setShowPersonnel(true);
      return;
    }

    const updated = tasks.map((t) =>
      t.id === id ? { ...t, ...fields } : t
    );

    setTasks(updated);

    if (!fields.delete) {
      const updatedTask = updated.find(t => t.id === id);
      setSelectedTaskForPopup(updatedTask);
    }
  };


  /* ====================================================================
     RENDER
     ==================================================================== */

  return (
    <>

      {filteredTasks.map((task) => (
        <div
          key={task.id}
          className="pp-task-item"
          onClick={() => openPopup(task)}
        >
          <div
            className={`pp-status-dot ${
              task.status === "Completed"
                ? "status-green"
                : task.person
                ? "status-amber"
                : "status-grey"
            }`}
          ></div>

          <div className="pp-task-title">{task.title}</div>

          {task.flag === "red" && <div className="pp-flag-dot">🚩</div>}
        </div>
      ))}

      {showAddItem && (
        <AddItemPopup
          onAdd={handleAddTask}
          onClose={() => setShowAddItem(false)}
        />
      )}

      {showPersonnel && (
        <PersonnelOverlay
          onSelect={handleSelectPerson}
          onClose={closePersonnel}
        />
      )}

      {selectedTaskForPopup && (
        <TaskPopup
          task={selectedTaskForPopup}
          onClose={() => setSelectedTaskForPopup(null)}
          onUpdate={(fields) =>
            updateTask(selectedTaskForPopup.id, fields)
          }
        />
      )}
    </>
  );
}

export default forwardRef(PreProjectComponent);
