const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const ownershipGrid = document.querySelector(".ownership-grid");
if (ownershipGrid) ownershipGrid.classList.add("strategy-grid");

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  const revealTargets = [
    ".section-heading",
    ".case-card",
    ".strategy-grid article",
    ".execution-block",
    ".work-card",
    ".about-sticky",
    ".about-copy",
    ".contact-box",
    ".case-page-hero .container",
    ".case-prose section",
    ".case-aside"
  ];

  document.querySelectorAll(revealTargets.join(",")).forEach((element, index) => {
    element.classList.add("reveal");
    if (element.matches(".about-sticky, .case-aside")) element.classList.add("reveal-left");
    if (element.matches(".about-copy")) element.classList.add("reveal-right");
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 65}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}
