/* ======================================================================
   METRA – GlobalToast.jsx
   Enterprise Toast System (Dec 2025)
   ----------------------------------------------------------------------
   ✔ Neutral grey toast
   ✔ 2-second auto-dismiss
   ✔ Queueing supported
   ✔ Smooth fade in/out
   ✔ Exposes window.METRA_toast("message")
   ====================================================================== */

import React, { createContext, useContext, useState, useEffect } from "react";
import "../Styles/GlobalToast.css";

// --------------------------------------------------------------
// CONTEXT
// --------------------------------------------------------------
const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

// --------------------------------------------------------------
// PROVIDER
// --------------------------------------------------------------
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Add toast
  const addToast = (message) => {
    const id = Date.now() + Math.random();

    setToasts(prev => [...prev, { id, message }]);

    // Auto-remove after 2 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2000);
  };

  // ⭐ GLOBAL ACCESS (crucial)
  useEffect(() => {
    window.METRA_toast = addToast;
    return () => {
      window.METRA_toast = null;
    };
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}

      {/* Toast Overlay */}
      <div className="toast-overlay">
        {toasts.map(t => (
          <div key={t.id} className="toast-item">
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
