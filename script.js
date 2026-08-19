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

document.querySelectorAll(".placeholder-link").forEach((link) => {
  if (link.getAttribute("href") === "#") {
    link.addEventListener("click", (event) => event.preventDefault());
  }
});

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
