// src/utils/windowTracker.js

// Key used in localStorage
const trackerKey = "metraOpenWindows";

// Read the current state
export function getOpenWindows() {
  const data = localStorage.getItem(trackerKey);
  return data ? JSON.parse(data) : {};
}

// Update the status for one module
export function setWindowStatus(module, isOpen) {
  const state = getOpenWindows();
  state[module] = isOpen;
  localStorage.setItem(trackerKey, JSON.stringify(state));
  window.dispatchEvent(new Event("storage")); // notify other windows
}

// Close all open windows (called from Summary)
export function closeAllWindows() {
  const state = getOpenWindows();
  for (const mod in state) {
    if (state[mod] && window[mod + "Window"] && !window[mod + "Window"].closed) {
      window[mod + "Window"].close();
      state[mod] = false;
    }
  }
  localStorage.setItem(trackerKey, JSON.stringify(state));
  window.dispatchEvent(new Event("storage"));
}
