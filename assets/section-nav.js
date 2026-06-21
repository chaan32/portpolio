(() => {
  const localLinks = [...document.querySelectorAll('a[href^="#"]')]
    .filter((link) => link.getAttribute("href").length > 1);

  if (localLinks.length === 0) return;

  const targets = [...new Set(localLinks.map((link) => link.getAttribute("href").slice(1)))]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (targets.length === 0) return;

  const setActive = (id) => {
    localLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  };

  const getHeaderOffset = () => {
    const header = document.querySelector(".site-header");
    return (header?.offsetHeight || 0) + 32;
  };

  const getCurrentTarget = () => {
    const marker = window.scrollY + getHeaderOffset() + 8;
    const orderedTargets = [...targets].sort((a, b) => a.offsetTop - b.offsetTop);
    let current = orderedTargets[0];

    for (const target of orderedTargets) {
      if (target.offsetTop <= marker) {
        current = target;
      } else {
        break;
      }
    }

    const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    return bottom ? orderedTargets[orderedTargets.length - 1] : current;
  };

  let ticking = false;
  const updateActive = () => {
    ticking = false;
    setActive(getCurrentTarget().id);
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateActive);
  };

  localLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.getAttribute("href").slice(1);
      if (document.getElementById(id)) {
        setActive(id);
      }
    });
  });

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.addEventListener("load", updateActive);
  updateActive();
})();
