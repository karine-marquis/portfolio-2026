const body = document.body;
const progress = document.createElement("div");
progress.className = "progress";
document.body.appendChild(progress);
window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progress.style.width = `${scrolled}%`;
});
const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav");
if (burger && nav)
  burger.addEventListener("click", () => nav.classList.toggle("open"));
document.querySelectorAll("a[href]").forEach((link) => {
  const href = link.getAttribute("href");

  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return;
  }

  link.addEventListener("click", (e) => {
    const url = new URL(link.href, location.href);

    if (url.origin !== location.origin) return;

    // Laisse les ancres de la même page fonctionner normalement
    if (url.pathname === location.pathname && url.hash) return;

    e.preventDefault();
    body.classList.add("fade-out");

    setTimeout(() => {
      location.href = link.href;
    }, 260);
  });
});
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
const form = document.querySelector("[data-contact-form]");
if (form)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    document.querySelector(".toast")?.classList.add("show");
    form.reset();
  });
function updateActiveNav() {
  const navLinks = document.querySelectorAll(".nav a");
  const currentPage = location.pathname.split("/").pop() || "index.html";

  navLinks.forEach((link) => link.classList.remove("active"));

  let activeLabel = "";

  if (currentPage === "index.html") {
    activeLabel = "Accueil";
  } else if (currentPage === "approche.html") {
    activeLabel = "Approche";
  } else if (
    currentPage === "projets.html" ||
    currentPage.startsWith("projet-")
  ) {
    activeLabel = "Projets";
  } else if (currentPage === "offre.html") {
    activeLabel = "Offre";
  } else if (currentPage === "apropos.html") {
    activeLabel = "À propos";
  } else if (
    currentPage === "journal.html" ||
    currentPage.startsWith("article-")
  ) {
    activeLabel = "À lire";
  } else if (currentPage === "contact.html") {
    activeLabel = "Contact";
  }

  const activeLink = Array.from(navLinks).find(
    (link) => link.textContent.trim() === activeLabel
  );

  if (activeLink) {
    activeLink.classList.add("active");
  }
}

updateActiveNav();
window.addEventListener("hashchange", updateActiveNav);