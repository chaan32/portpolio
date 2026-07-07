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

(() => {
  const imageTargets = [
    ...document.querySelectorAll(".media-card img, .profile-card img"),
  ];

  if (imageTargets.length === 0) return;

  const lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "이미지 크게 보기");
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <button class="image-lightbox-close" type="button" aria-label="닫기">×</button>
    <figure class="image-lightbox-frame">
      <img alt="" />
      <figcaption></figcaption>
    </figure>
  `;
  document.body.append(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector("figcaption");
  const closeButton = lightbox.querySelector(".image-lightbox-close");

  const getCaption = (image) => {
    const mediaCaption = image.closest(".media-card")?.querySelector("figcaption");
    return mediaCaption?.textContent.trim() || image.alt || "";
  };

  const openLightbox = (image) => {
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "";

    const caption = getCaption(image);
    lightboxCaption.textContent = caption;
    lightboxCaption.hidden = caption.length === 0;

    lightbox.hidden = false;
    document.body.classList.add("is-lightbox-open");
    closeButton.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxImage.removeAttribute("src");
    document.body.classList.remove("is-lightbox-open");
  };

  imageTargets.forEach((image) => {
    image.classList.add("is-zoomable-image");
    image.tabIndex = 0;

    image.addEventListener("click", () => openLightbox(image));
    image.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openLightbox(image);
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
})();
