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

// ---- interactive terminal navigator ----
(() => {
  const out = document.getElementById("termnav-out");
  const input = document.getElementById("termnav-input");
  const screen = document.getElementById("termnav-screen");
  if (!out || !input) return;

  const projects = [
    ["debian-lsp", "Language tooling for GSoC 2026 with Debian"],
    ["tiger", "Tiger Compiler, SSA back-end at EPITA"],
    ["gccrs", "GCC Rust front-end (Embecosm internship)"],
    ["swift", "Swift compiler, open source"],
    ["swift-nixos", "Swift 6.5 toolchain from source on NixOS"],
    ["lux", "Helix-inspired modal editor in Rust"],
    ["mole", "Keyboard-driven X11 pointer navigator"],
    ["42sh", "POSIX shell in C"],
  ];
  const slugs = projects.map((p) => p[0]);

  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const print = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    out.appendChild(div);
    screen.scrollTop = screen.scrollHeight;
  };
  const go = (slug) => {
    print(`<span class="ok">opening</span> projects/${slug}/ …`);
    setTimeout(() => (window.location.href = `projects/${slug}/`), 260);
  };

  const lsProjects = () =>
    projects
      .map(([s, d]) => `  <a href="projects/${s}/" data-open="${s}">${s.padEnd(12)}</a><span class="dim"> ${esc(d)}</span>`)
      .join("\n");

  const commands = {
    help: () =>
      [
        "available commands:",
        '  <span class="cy">ls</span> [projects]   list the projects',
        '  <span class="cy">open</span> &lt;name&gt;     open a project page  (alias: cd)',
        '  <span class="cy">whoami</span>          who is this',
        '  <span class="cy">about</span>           the short version',
        '  <span class="cy">notes</span>           build journals',
        '  <span class="cy">contact</span>         how to reach me',
        '  <span class="cy">clear</span>           clear the screen',
      ].join("\n"),
    ls: (arg) => lsProjects(),
    projects: () => lsProjects(),
    whoami: () =>
      'Lucas Ly Ba: low-level &amp; systems engineer. Compilers, developer tools, systems software in Rust, C and C++. <span class="dim">EPITA · GSoC 2026 · Embecosm.</span>',
    about: () =>
      "I build compilers and the tools that sit close to the machine. GSoC 2026 with Debian, gccrs at Embecosm, Tiger maintainer at EPITA, plus my own editor, shell and X11 navigator.",
    notes: () =>
      'build journals: <a href="notes/swift-nixos/">swift-nixos</a> · <a href="notes/lux/">lux</a> · <a href="notes/mole/">mole</a>',
    contact: () =>
      'email <a href="mailto:hi@lucaslyba.com">hi@lucaslyba.com</a> · <a href="https://github.com/lucasly-ba" target="_blank" rel="noopener">github</a> · <a href="https://www.linkedin.com/in/lucas-ly-ba-a546b7294" target="_blank" rel="noopener">linkedin</a>',
    sudo: () => '<span class="or">nice try.</span> you already have root here.',
    pwd: () => "/home/lucas/portfolio",
  };

  const run = (raw) => {
    const line = raw.trim();
    print(`<span class="dim">$</span> <span class="echo">${esc(line)}</span>`);
    if (!line) return;
    const [cmd, ...rest] = line.split(/\s+/);
    const arg = rest.join(" ");

    if (cmd === "clear") { out.innerHTML = ""; return; }
    if (cmd === "open" || cmd === "cd") {
      const t = (arg || "").replace(/\/$/, "");
      if (slugs.includes(t)) return go(t);
      return print(`<span class="or">open: ${esc(t || "(nothing)")}: no such project</span>. Try <span class="cy">ls</span>`);
    }
    if (slugs.includes(cmd)) return go(cmd); // bare slug
    if (commands[cmd]) return print(commands[cmd](arg));
    print(`<span class="or">${esc(cmd)}: command not found</span>. Type <span class="cy">help</span>`);
  };

  // open links emitted by `ls`
  out.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-open]");
    if (a) { e.preventDefault(); go(a.getAttribute("data-open")); }
  });

  const history = [];
  let hi = -1;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const v = input.value;
      if (v.trim()) { history.push(v); hi = history.length; }
      run(v);
      input.value = "";
    } else if (e.key === "ArrowUp") {
      if (hi > 0) input.value = history[--hi];
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      if (hi < history.length - 1) input.value = history[++hi];
      else { hi = history.length; input.value = ""; }
      e.preventDefault();
    }
  });
  screen.addEventListener("click", (e) => { if (!e.target.closest("a")) input.focus(); });

  print('<span class="dim">type</span> <span class="cy">help</span> <span class="dim">to begin, or</span> <span class="cy">ls projects</span> <span class="dim">to look around.</span>');
})();

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
