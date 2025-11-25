// public/scrollFix.js
// Purpose: Smoothly auto-scroll .checklist containers when new <li> items are added.
// This runs after the React app mounts, so it cannot break styling or persistence.

(function () {
  function scrollBox(box) {
    try {
      box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
    } catch {
      box.scrollTop = box.scrollHeight;
    }
  }

  const listObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "childList" && m.addedNodes.length) {
        const box = m.target.closest(".checklist");
        if (box) scrollBox(box);
      }
    }
  });

  function attach() {
    document.querySelectorAll(".checklist ul").forEach((ul) => {
      if (!ul.__observed) {
        listObserver.observe(ul, { childList: true });
        ul.__observed = true;
      }
    });
  }

  // Wait until app content is visible before attaching observers
  const wait = setInterval(() => {
    if (document.querySelector(".checklist ul")) {
      clearInterval(wait);
      attach();
    }
  }, 500);
})();
