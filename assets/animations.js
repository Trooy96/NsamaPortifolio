// High-end animations + interactions powered by anime.js v4.
// Injected dynamically by the root component so it never participates in SSR.
import {
  animate,
  createTimeline,
  createDrawable,
  stagger,
  onScroll,
} from "https://cdn.jsdelivr.net/npm/animejs@4.2.2/+esm";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const seen = new WeakSet();

/* ---------- Cursor glow ---------- */
function mountCursorGlow() {
  if (reduced || matchMedia("(pointer: coarse)").matches) return;
  if (document.querySelector(".cursor-glow")) return;
  const g = document.createElement("div");
  g.className = "cursor-glow";
  document.body.appendChild(g);
  window.addEventListener("pointermove", (e) => {
    g.style.opacity = "1";
    g.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });
  window.addEventListener("pointerleave", () => (g.style.opacity = "0"));
}

/* ---------- Reveal on scroll ---------- */
function mountReveal() {
  const vh = window.innerHeight || 800;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -5% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => {
    if (seen.has(el)) return;
    seen.add(el);
    // Reveal anything already in or near the viewport immediately — no fade-in lag.
    const r = el.getBoundingClientRect();
    if (r.top < vh * 1.1) {
      el.classList.add("is-visible");
      return;
    }
    io.observe(el);
  });
}

/* ---------- Dot grid stagger ---------- */
function mountDotGrid() {
  document.querySelectorAll("[data-dot-grid]").forEach((grid) => {
    if (seen.has(grid)) return;
    seen.add(grid);
    grid.innerHTML = "";
    for (let i = 0; i < 169; i++) {
      const d = document.createElement("span");
      d.className = "dot";
      grid.appendChild(d);
    }
    const options = { grid: [13, 13], from: "center" };
    try {
      createTimeline({
        loop: true,
        autoplay: reduced ? false : onScroll({ sync: 0.6 }),
      }).add(
        grid.querySelectorAll(".dot"),
        {
          scale: stagger([1.15, 0.5], options),
          opacity: stagger([0.9, 0.25], options),
          ease: "inOutQuad",
          duration: 1400,
        },
        stagger(80, options)
      );
    } catch (err) {
      console.warn("dot grid animation skipped", err);
    }
  });
}


/* ---------- SVG draw on scroll ---------- */
function mountDrawables() {
  document.querySelectorAll("[data-draw] path").forEach((path) => {
    if (seen.has(path)) return;
    seen.add(path);
    const drawable = createDrawable(path);
    animate(drawable, {
      draw: ["0 0", "0 1", "1 1"],
      delay: stagger(40),
      ease: "inOut(3)",
      duration: 2200,
      autoplay: reduced ? true : onScroll({ sync: true, enter: "bottom top" }),
    });
  });
}

/* ---------- Hero title flourish ---------- */
function mountHero() {
  const title = document.querySelector("[data-hero-title]");
  if (!title || reduced || seen.has(title)) return;
  seen.add(title);
  const words = title.textContent.trim().split(/\s+/);
  title.innerHTML = words
    .map(
      (w) =>
        `<span class="inline-block overflow-hidden align-top"><span class="inline-block translate-y-full" data-word>${w}&nbsp;</span></span>`
    )
    .join("");
  animate(title.querySelectorAll("[data-word]"), {
    translateY: ["100%", "0%"],
    opacity: [0, 1],
    duration: 900,
    delay: stagger(80),
    ease: "out(4)",
  });
}

/* ---------- Magnetic buttons ---------- */
function mountMagnets() {
  if (reduced) return;
  document.querySelectorAll("[data-magnet]").forEach((el) => {
    if (seen.has(el)) return;
    seen.add(el);
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.25}px)`;
    });
    el.addEventListener("pointerleave", () => (el.style.transform = ""));
  });
}

function safe(name, fn) {
  try { fn(); } catch (e) { console.warn(`[portfolio] ${name} failed`, e); }
}

function init() {
  safe("cursorGlow", mountCursorGlow);
  safe("reveal", mountReveal);
  safe("dotGrid", mountDotGrid);
  safe("drawables", mountDrawables);
  safe("hero", mountHero);
  safe("magnets", mountMagnets);
}


// Run as early as possible, then on every route change.
init();
requestAnimationFrame(init);

// TanStack Router uses history.pushState — patch it to re-init.
const origPush = history.pushState;
history.pushState = function (...args) {
  const r = origPush.apply(this, args);
  requestAnimationFrame(init);
  return r;
};
const origReplace = history.replaceState;
history.replaceState = function (...args) {
  const r = origReplace.apply(this, args);
  requestAnimationFrame(init);
  return r;
};
window.addEventListener("popstate", () => requestAnimationFrame(init));
