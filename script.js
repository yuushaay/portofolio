// Animasi nama di hero saat halaman dibuka
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if (window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion.matches) {
  const trailDots = Array.from({ length: 7 }, (_, index) => {
    const dot = document.createElement("span");
    dot.className = "cosmic-cursor-dot";
    dot.style.setProperty("--trail-size", `${18 - index * 2}px`);
    dot.style.setProperty("--trail-opacity", `${0.9 - index * 0.1}`);
    document.body.append(dot);
    return { element: dot, x: 0, y: 0 };
  });
  let pointerX = 0;
  let pointerY = 0;
  let animationFrame = 0;

  const animateCursorTrail = () => {
    let needsAnotherFrame = false;
    trailDots.forEach((dot, index) => {
      const targetX = index === 0 ? pointerX : trailDots[index - 1].x;
      const targetY = index === 0 ? pointerY : trailDots[index - 1].y;
      const easing = index === 0 ? 0.42 : 0.3 - index * 0.025;
      dot.x += (targetX - dot.x) * easing;
      dot.y += (targetY - dot.y) * easing;
      dot.element.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%)`;
      if (Math.abs(targetX - dot.x) > 0.1 || Math.abs(targetY - dot.y) > 0.1) {
        needsAnotherFrame = true;
      }
    });

    animationFrame = needsAnotherFrame ? window.requestAnimationFrame(animateCursorTrail) : 0;
  };

  window.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    trailDots.forEach((dot) => dot.element.classList.add("is-visible"));
    if (!animationFrame) animationFrame = window.requestAnimationFrame(animateCursorTrail);
  }, { passive: true });
}

const tiltCard = document.querySelector("[data-tilt-card]");
if (tiltCard) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let isFlipped = false;
  let isPressed = false;
  let hasMoved = false;
  let startX = 0;
  let startY = 0;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const setTilt = (tiltX, tiltY) => {
    tiltCard.style.setProperty("--card-tilt-x", `${tiltX}deg`);
    tiltCard.style.setProperty("--card-turn", `${tiltY - 8}deg`);
  };
  const resetTilt = () => setTilt(0, 0);
  const flipCard = () => {
    isFlipped = !isFlipped;
    tiltCard.setAttribute("aria-pressed", String(isFlipped));
    tiltCard.classList.toggle("is-flipped", isFlipped);
    setTilt(0, 0);
  };

  tiltCard.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    isPressed = true;
    hasMoved = false;
    startX = event.clientX;
    startY = event.clientY;
    const bounds = tiltCard.getBoundingClientRect();
    tiltCard.style.setProperty("--pointer-x", `${clamp((event.clientX - bounds.left) / bounds.width, 0, 1) * 100}%`);
    tiltCard.style.setProperty("--pointer-y", `${clamp((event.clientY - bounds.top) / bounds.height, 0, 1) * 100}%`);
    tiltCard.classList.add("is-tilting");
    tiltCard.setPointerCapture(event.pointerId);
  });

  tiltCard.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch" && !isPressed) return;
    const bounds = tiltCard.getBoundingClientRect();
    const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;
    if (event.pointerType !== "touch" || isPressed) {
      tiltCard.style.setProperty("--pointer-x", `${(normalizedX + 0.5) * 100}%`);
      tiltCard.style.setProperty("--pointer-y", `${(normalizedY + 0.5) * 100}%`);
      tiltCard.classList.add("is-pointer-over");
    }
    if (!reducedMotion) {
      setTilt(clamp(-normalizedY * 24, -12, 12), clamp(normalizedX * 32, -16, 16));
    }
    if (isPressed && (Math.abs(event.clientX - startX) > 8 || Math.abs(event.clientY - startY) > 8)) {
      hasMoved = true;
    }
  });

  const releaseCard = (event, canFlip) => {
    if (!isPressed) return;
    isPressed = false;
    tiltCard.classList.remove("is-tilting");
    if (tiltCard.hasPointerCapture(event.pointerId)) tiltCard.releasePointerCapture(event.pointerId);
    if (canFlip && !hasMoved && event.pointerType === "touch") flipCard();
    else resetTilt();
  };
  tiltCard.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "touch") tiltCard.classList.add("is-pointer-over");
  });
  tiltCard.addEventListener("pointerup", (event) => releaseCard(event, true));
  tiltCard.addEventListener("pointercancel", (event) => releaseCard(event, false));
  tiltCard.addEventListener("pointerleave", (event) => {
    tiltCard.classList.remove("is-pointer-over");
    if (event.pointerType !== "touch" && !isPressed) resetTilt();
  });
  tiltCard.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    flipCard();
  });
}

const typedCopy = document.querySelector(".typed-copy");
if (typedCopy && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const fullText = typedCopy.textContent;
  let typedLength = 0;
  typedCopy.textContent = "";

  const typeNextCharacter = () => {
    typedLength += 1;
    typedCopy.textContent = fullText.slice(0, typedLength);
    if (typedLength < fullText.length) {
      window.setTimeout(typeNextCharacter, 35);
    }
  };

  window.setTimeout(typeNextCharacter, 400);
}

// Tahun otomatis di footer
const tahun = document.getElementById("tahun");
if (tahun) tahun.textContent = new Date().getFullYear();

// Tandai menu yang sedang aktif saat scroll
const links = document.querySelectorAll(".nav a");
const sections = [...links]
  .filter((a) => a.getAttribute("href").startsWith("#"))
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((a) =>
            a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
          );
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => observer.observe(s));
}

if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const revealObserver = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  const revealTargets = document.querySelectorAll(
    "main > section, main h1, main h2, main h3, main p, main figure, main figure img, main .actions, .education-list > li, .image-gallery > li, .project-list > li, .certificate-list > li, .skill-list > div, .skill-list dt, .skill-list dd"
  );
  revealTargets.forEach((target) => {
    target.classList.add("reveal-on-scroll");
    if (target instanceof HTMLImageElement) target.classList.add("reveal-image");
    const siblings = target.parentElement ? Array.from(target.parentElement.children) : [];
    const siblingIndex = siblings.indexOf(target);
    target.style.transitionDelay = `${Math.min(siblingIndex, 6) * 110}ms`;
    revealObserver.observe(target);
  });
}

document.addEventListener("click", (event) => {
  if (prefersReducedMotion.matches || !(event.target instanceof Element) || event.target.closest("img, [data-tilt-card]")) return;

  const originX = event.clientX;
  const originY = event.clientY;
  const colors = ["#ff7771", "#ffd166", "#ffffff", "#e43630"];
  const rocket = document.createElement("span");
  rocket.className = "firework-rocket";
  rocket.setAttribute("aria-hidden", "true");
  rocket.style.setProperty("--firework-x", `${originX}px`);
  rocket.style.setProperty("--firework-rise", `${originY - window.innerHeight}px`);
  rocket.addEventListener("animationend", () => rocket.remove(), { once: true });
  document.body.append(rocket);

  const flash = document.createElement("span");
  flash.className = "firework-flash";
  flash.setAttribute("aria-hidden", "true");
  flash.style.setProperty("--firework-x", `${originX}px`);
  flash.style.setProperty("--firework-y", `${originY}px`);
  flash.addEventListener("animationend", () => flash.remove(), { once: true });
  document.body.append(flash);

  for (let index = 0; index < 36; index += 1) {
    const angle = (Math.PI * 2 * index) / 36;
    const distance = 44 + Math.random() * 72;
    const spark = document.createElement("span");
    spark.className = "firework-spark";
    spark.setAttribute("aria-hidden", "true");
    spark.style.setProperty("--firework-x", `${originX}px`);
    spark.style.setProperty("--firework-y", `${originY}px`);
    spark.style.setProperty("--burst-x", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--burst-y", `${Math.sin(angle) * distance}px`);
    spark.style.setProperty("--firework-color", colors[index % colors.length]);
    spark.addEventListener("animationend", () => spark.remove(), { once: true });
    document.body.append(spark);
  }
});
