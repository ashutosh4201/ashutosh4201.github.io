const THEME_KEY = "portfolio-theme";
const themeToggle = document.getElementById("themeToggle");

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (_) {}
  const meta = document.getElementById("theme-color-meta");
  if (meta) meta.setAttribute("content", theme === "dark" ? "#1c1719" : "#fff8e7");
  if (themeToggle) {
    const dark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(dark));
    themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    setTheme(current === "dark" ? "light" : "dark");
  });
  setTheme(document.documentElement.getAttribute("data-theme") || "light");
}

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  try {
    if (!localStorage.getItem(THEME_KEY)) setTheme(e.matches ? "dark" : "light");
  } catch (_) {}
});

const header = document.getElementById("header");
const menuBtn = document.querySelector(".menu-btn");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileMenuClose = document.querySelector(".mobile-menu-close");

function closeMobileMenu() {
  if (!mobileMenu || !menuBtn) return;
  mobileMenu.setAttribute("hidden", "");
  menuBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

function openMobileMenu() {
  if (!mobileMenu || !menuBtn) return;
  mobileMenu.removeAttribute("hidden");
  menuBtn.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function scrollToSection(id) {
  const target = document.querySelector(id);
  if (!target) return;
  const headerH = header?.offsetHeight ?? 76;
  const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
  window.scrollTo({ top, behavior: "smooth" });
}

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 24);
});

const sections = ["work", "experience", "about", "contact"];
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      document.querySelectorAll(".nav a, .mobile-menu nav a").forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach((id) => {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    if (mobileMenu.hasAttribute("hidden")) openMobileMenu();
    else closeMobileMenu();
  });

  mobileMenuClose?.addEventListener("click", closeMobileMenu);

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (link.getAttribute("href")?.startsWith("#")) closeMobileMenu();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !mobileMenu.hasAttribute("hidden")) closeMobileMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) closeMobileMenu();
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const id = anchor.getAttribute("href");
    if (id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    scrollToSection(id);
  });
});

window.addEventListener("load", () => {
  document.querySelector(".page-loader")?.remove();
});
