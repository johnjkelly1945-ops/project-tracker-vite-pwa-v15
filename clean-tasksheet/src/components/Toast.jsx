/* ======================================================================
   METRA – Toast.jsx
   Lightweight toast message (bottom centre)
   ====================================================================== */

import React from "react";
import "../Styles/Toast.css";

export default function Toast({ message }) {
  return <div className="toast-box">{message}</div>;
}
