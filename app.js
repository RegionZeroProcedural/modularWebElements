/* =========================================================
   Reaper UI Showcase
   Reusable interaction systems
   ========================================================= */

const SELECTORS = {
  menuToggle: ".menu-toggle",
  mobileNav: ".mobile-nav",
  glass: "[data-glass], .liquid-glass, .liquid-button",
  tilt: "[data-tilt]",
  ambientBg: ".ambient-bg",
  reveal: ".reveal",
  bgVideo: "#bgVideo",
  tiktokGrid: "#tiktok-grid",
  latestThreads: "#latestThreads",
};

const BREAKPOINTS = {
  mobile: 768,
};

/* -----------------------------
   Mobile navigation
----------------------------- */

function initMobileNav() {
  const menuToggle = document.querySelector(SELECTORS.menuToggle);
  const mobileNav = document.querySelector(SELECTORS.mobileNav);

  if (!menuToggle || !mobileNav) return;

  const closeMobileNav = () => {
    mobileNav.classList.remove("active");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  };

  const openMobileNav = () => {
    mobileNav.classList.add("active");
    menuToggle.textContent = "×";
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
  };

  menuToggle.setAttribute("aria-expanded", "false");

  menuToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.contains("active");
    isOpen ? closeMobileNav() : openMobileNav();
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > BREAKPOINTS.mobile) {
      closeMobileNav();
    }
  });
}

/* -----------------------------
   Progressive video quality swap
----------------------------- */

function initVideoSwap() {
  const bgVideo = document.querySelector(SELECTORS.bgVideo);
  if (!bgVideo) return;

  const highQualitySrc = "video/background-hq.mp4";

  const preloadVideo = document.createElement("video");
  preloadVideo.src = highQualitySrc;
  preloadVideo.muted = true;
  preloadVideo.loop = true;
  preloadVideo.playsInline = true;
  preloadVideo.preload = "auto";

  preloadVideo.addEventListener("canplaythrough", () => {
    const currentTime = bgVideo.currentTime || 0;

    bgVideo.src = highQualitySrc;
    bgVideo.currentTime = currentTime;
    bgVideo.play().catch(() => {});
  }, { once: true });

  preloadVideo.addEventListener("error", () => {
    // Keep the preview/fallback background if the HQ file is not present.
  }, { once: true });

  preloadVideo.load();
}

/* -----------------------------
   Glass mouse highlight
----------------------------- */

function initGlassHighlights() {
  const glassElements = document.querySelectorAll(SELECTORS.glass);

  glassElements.forEach((element) => {
    element.style.setProperty("--mx", "50%");
    element.style.setProperty("--my", "50%");

    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();

      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      element.style.setProperty("--mx", `${x}%`);
      element.style.setProperty("--my", `${y}%`);
    });

    element.addEventListener("pointerleave", () => {
      element.style.setProperty("--mx", "50%");
      element.style.setProperty("--my", "50%");
    });
  });
}

/* -----------------------------
   Reusable 3D hover cards
   - Tilt follows cursor
   - Glow tracks cursor
   - Border sheen appears opposite cursor
----------------------------- */

function initTiltCards() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const tiltCards = document.querySelectorAll(SELECTORS.tilt);

  tiltCards.forEach((card) => {
    const maxTilt = Number(card.dataset.maxTilt || 10);
    const lift = Number(card.dataset.lift || 4);

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * maxTilt;
      const rotateX = ((centerY - y) / centerY) * maxTilt;

      const mouseX = (x / rect.width) * 100;
      const mouseY = (y / rect.height) * 100;

      card.style.transform = `
        translateY(-${lift}px)
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;

      card.style.setProperty("--mouse-x", `${mouseX}%`);
      card.style.setProperty("--mouse-y", `${mouseY}%`);
      card.style.setProperty("--opposite-x", `${100 - mouseX}%`);
      card.style.setProperty("--opposite-y", `${100 - mouseY}%`);

      /* Keep the glass highlight synced too. */
      card.style.setProperty("--mx", `${mouseX}%`);
      card.style.setProperty("--my", `${mouseY}%`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
      card.style.removeProperty("--mouse-x");
      card.style.removeProperty("--mouse-y");
      card.style.removeProperty("--opposite-x");
      card.style.removeProperty("--opposite-y");
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "50%");
    });
  });
}

/* -----------------------------
   Scroll-reactive ambient background
----------------------------- */

function initScrollBackground() {
  const ambientBg = document.querySelector(SELECTORS.ambientBg);
  if (!ambientBg) return;

  const update = () => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

    document.documentElement.style.setProperty("--scroll-x", `${scrollY * -0.035}px`);
    document.documentElement.style.setProperty("--scroll-y", `${scrollY * 0.055}px`);
    document.documentElement.style.setProperty("--scroll-scale", `${1 + progress * 0.06}`);
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* -----------------------------
   Reveal-on-scroll
----------------------------- */

function initReveal() {
  const revealElements = document.querySelectorAll(SELECTORS.reveal);

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.18,
    rootMargin: "0px 0px -60px 0px",
  });

  revealElements.forEach((element) => observer.observe(element));
}

/* -----------------------------
   TikTok embeds from videos.json
----------------------------- */

async function initTikTokFeed() {
  const tiktokGrid = document.querySelector(SELECTORS.tiktokGrid);
  if (!tiktokGrid) return;

  try {
    const response = await fetch("videos.json");
    if (!response.ok) throw new Error("Could not load videos.json");

    const videos = await response.json();
    if (!Array.isArray(videos) || videos.length === 0) return;

    tiktokGrid.innerHTML = "";

    videos.forEach((id) => {
      const embed = document.createElement("blockquote");
      embed.className = "tiktok-embed";
      embed.setAttribute("cite", `https://www.tiktok.com/@region_zero/video/${id}`);
      embed.setAttribute("data-video-id", id);

      embed.innerHTML = `
        <a href="https://www.tiktok.com/@region_zero/video/${id}">
          Watch on TikTok
        </a>
      `;

      tiktokGrid.appendChild(embed);
    });

    const tiktokScript = document.createElement("script");
    tiktokScript.src = "https://www.tiktok.com/embed.js";
    tiktokScript.async = true;
    document.body.appendChild(tiktokScript);
  } catch (error) {
    console.warn("TikTok feed unavailable:", error);
  }
}

/* -----------------------------
   Latest forum threads from JSON
----------------------------- */

async function initLatestThreads() {
  const latestThreadsContainer = document.querySelector(SELECTORS.latestThreads);
  if (!latestThreadsContainer) return;

  try {
    const response = await fetch("Forums/forumData.json");
    if (!response.ok) throw new Error("Could not load Forums/forumData.json");

    const data = await response.json();
    const categories = data?.categories || {};

    const allThreads = Object.values(categories)
      .flatMap((category) => category.threads || [])
      .map((thread) => ({
        title: thread.title || "Untitled thread",
        preview: thread.preview || "No preview available.",
      }));

    const latestThreads = allThreads.slice(0, 3);
    if (latestThreads.length === 0) return;

    latestThreadsContainer.innerHTML = "";

    latestThreads.forEach((thread) => {
      const threadDiv = document.createElement("div");
      threadDiv.className = "thread";

      threadDiv.innerHTML = `
        <h3>${thread.title}</h3>
        <p>${thread.preview}</p>
      `;

      latestThreadsContainer.appendChild(threadDiv);
    });
  } catch (error) {
    console.warn("Latest forum threads unavailable:", error);
  }
}

/* -----------------------------
   Init
----------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initVideoSwap();
  initGlassHighlights();
  initTiltCards();
  initScrollBackground();
  initReveal();
  initTikTokFeed();
  initLatestThreads();
});

function initTiltCards() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const tiltCards = document.querySelectorAll(SELECTORS.tilt);

  tiltCards.forEach((card) => {
    const maxTilt = Number(card.dataset.maxTilt || 10);
    const lift = Number(card.dataset.lift || 4);

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * maxTilt;
      const rotateX = ((centerY - y) / centerY) * maxTilt;

      const mouseX = (x / rect.width) * 100;
      const mouseY = (y / rect.height) * 100;

      card.style.transform = `
        perspective(1000px)
        translateY(-${lift}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;

      card.style.setProperty("--mouse-x", `${mouseX}%`);
      card.style.setProperty("--mouse-y", `${mouseY}%`);
      card.style.setProperty("--opposite-x", `${100 - mouseX}%`);
      card.style.setProperty("--opposite-y", `${100 - mouseY}%`);
      card.style.setProperty("--mx", `${mouseX}%`);
      card.style.setProperty("--my", `${mouseY}%`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = `
        perspective(1000px)
        translateY(0)
        rotateX(0deg)
        rotateY(0deg)
      `;

      card.style.setProperty("--mouse-x", "50%");
      card.style.setProperty("--mouse-y", "50%");
      card.style.setProperty("--opposite-x", "50%");
      card.style.setProperty("--opposite-y", "50%");
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "50%");
    });
  });
}