// Animasi nama di hero saat halaman dibuka
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

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
    "main > section, .education-list > li, .image-gallery > li, .project-list > li, .certificate-list > li, .skill-list > div"
  );
  revealTargets.forEach((target) => {
    target.classList.add("reveal-on-scroll");
    revealObserver.observe(target);
  });
}
