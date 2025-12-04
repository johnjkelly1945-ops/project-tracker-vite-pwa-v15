/* ======================================================================
   METRA – Toast.jsx
   v5 Baseline – Bottom-Right Toast Message
   ----------------------------------------------------------------------
   ✔ Used for delete warnings
   ✔ Auto-hides after 3 seconds
   ✔ Non-intrusive, bottom-right placement
   ====================================================================== */

import React, { useEffect } from "react";
import "../Styles/Toast.css";

export default function Toast({ message, onHide }) {

  useEffect(() => {
    const t = setTimeout(() => {
      onHide();
    }, 3000);

    return () => clearTimeout(t);
  }, [onHide]);

  if (!message) return null;

  return (
    <div className="toast-container">
      <div className="toast-box">
        {message}
      </div>
    </div>
  );
}
