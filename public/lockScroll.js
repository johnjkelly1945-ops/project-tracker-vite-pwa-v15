// public/lockScroll.js
// Stop Safari from scrolling the whole page when a checklist hits its top/bottom.

(function () {
  function atTop(el) {
    return el.scrollTop <= 0;
  }
  function atBottom(el) {
    return el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
  }

  function onWheel(e) {
    const el = e.currentTarget;
    const down = e.deltaY > 0;
    if ((down && atBottom(el)) || (!down && atTop(el))) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function onTouchStart(e) {
    e.currentTarget.__startY = e.touches[0].clientY;
  }
  function onTouchMove(e) {
    const el = e.currentTarget;
    const startY = el.__startY ?? e.touches[0].clientY;
    const currentY = e.touches[0].clientY;
    const down = startY - currentY > 0; // swipe up
    if ((down && atBottom(el)) || (!down && atTop(el))) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function attach(el) {
    if (el.__scrollLockAttached) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.__scrollLockAttached = true;
  }

  function scan() {
    document.querySelectorAll(".checklist").forEach(attach);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scan);
  } else {
    scan();
  }

  // Observe future mounts
  const mo = new MutationObserver(scan);
  mo.observe(document.body, { childList: true, subtree: true });
})();
