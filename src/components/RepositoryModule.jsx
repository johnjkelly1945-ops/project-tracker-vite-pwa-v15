/* ============================================================
   METRA – Template Repository Overlay
   Ensures modal appears ABOVE everything else
   ============================================================ */

.repo-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000; /* 🔥 ABOVE TaskPopup */
}

.repo-window {
  width: 70vw;
  height: 70vh;
  background: white;
  border-radius: 10px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.repo-header {
  background: #0b3d91;
  color: white;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.repo-close {
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.repo-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.repo-list {
  width: 35%;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  padding: 10px;
}

.repo-item {
  padding: 8px 10px;
  cursor: pointer;
  border-radius: 6px;
}

.repo-item:hover {
  background: #f0f0f0;
}

.repo-item.selected {
  background: #d9e6ff;
}

.repo-preview {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.repo-download-btn,
.repo-attach-btn {
  display: inline-block;
  margin-top: 15px;
  padding: 10px 15px;
  background: #0b3d91;
  color: white;
  border-radius: 6px;
  text-decoration: none;
}

.repo-attach-btn {
  cursor: pointer;
}
