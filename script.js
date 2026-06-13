// ---- current year ----
document.getElementById("year").textContent = new Date().getFullYear();

// ---- scroll reveal ----
const reveals = document.querySelectorAll(".section, .hero__eyebrow, .hero__name, .hero__role, .hero__tagline, .hero__actions, .hero__badges, .terminal");
reveals.forEach((el) => el.setAttribute("data-reveal", ""));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
reveals.forEach((el) => io.observe(el));

// ---- card cursor glow ----
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
  });
});

// ---- mobile nav toggle ----
const nav = document.querySelector(".nav");
const navToggle = document.querySelector(".nav__toggle");
const navMenu = document.querySelector(".nav__links");

if (navToggle && nav) {
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  navToggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));

  // close when a link is tapped
  navMenu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => setMenu(false))
  );

  // close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  // close when tapping outside the nav
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("is-open") && !nav.contains(e.target)) setMenu(false);
  });

  // reset when resizing up to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) setMenu(false);
  });
}

// ---- active nav link on scroll ----
const navLinks = [...document.querySelectorAll(".nav__links a")];
const sections = navLinks
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const navIo = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const id = "#" + e.target.id;
        navLinks.forEach((a) =>
          a.style.setProperty("color", a.getAttribute("href") === id ? "var(--green)" : "")
        );
      }
    });
  },
  { threshold: 0.5 }
);
sections.forEach((s) => navIo.observe(s));
