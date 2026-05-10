/* ===== EDIT YOUR DATA HERE ===== */

const courses = [
  "Problem Solving", "C Programming", "Digital Logic",
  "Mathematics I", "Physics", "Engineering Graphics",
  "Data Structures (upcoming)", "Python (upcoming)"
];

const certifications = [
  {
    icon: "🐍",
    name: "Python for Everybody",
    by: "Coursera · University of Michigan",
    status: "done"
  },
  {
    icon: "🌐",
    name: "Responsive Web Design",
    by: "freeCodeCamp",
    status: "done"
  },
  {
    icon: "⚙️",
    name: "CS50: Intro to CS",
    by: "Harvard (edX)",
    status: "progress"
  },
  {
    icon: "📊",
    name: "Data Structures & Algorithms",
    by: "Self-paced · GeeksForGeeks",
    status: "progress"
  }
];

const projects = [
  {
    tag: "HTML · CSS",
    title: "My First Website",
    desc: "A static personal webpage built while learning HTML & CSS basics. Practiced layouts, colors, and typography.",
    stack: ["HTML", "CSS"],
    wip: false,
    link: "#"
  },
  {
    tag: "Python",
    title: "Calculator App",
    desc: "A command-line calculator in Python handling arithmetic operations. My first real program after learning conditionals and functions.",
    stack: ["Python"],
    wip: false,
    link: "#"
  },
  {
    tag: "C Programming",
    title: "Student Grade System",
    desc: "A C program that accepts student marks and calculates grades and averages. Built as part of my first semester coursework.",
    stack: ["C"],
    wip: false,
    link: "#"
  },
  {
    tag: "JavaScript",
    title: "To-Do List (WIP)",
    desc: "Learning JavaScript by building a browser-based to-do list. Currently adding localStorage support to save tasks.",
    stack: ["HTML", "CSS", "JavaScript"],
    wip: true,
    link: "#"
  }
];

/* ===== RENDER COURSEWORK TAGS ===== */
const courseList = document.getElementById("courses-list");
if (courseList) {
  courses.forEach(c => {
    const tag = document.createElement("span");
    tag.className = "course-tag";
    tag.textContent = c;
    courseList.appendChild(tag);
  });
}

/* ===== RENDER CERTIFICATIONS ===== */
const certsGrid = document.getElementById("certs-grid");
if (certsGrid) {
  certifications.forEach((cert, i) => {
    const card = document.createElement("div");
    card.className = "cert-card reveal";
    card.style.transitionDelay = `${i * 80}ms`;
    card.innerHTML = `
      <div class="cert-icon">${cert.icon}</div>
      <div class="cert-name">${cert.name}</div>
      <div class="cert-by">${cert.by}</div>
      <span class="cert-status ${cert.status}">
        ${cert.status === "done" ? "✓ Completed" : "⏳ In Progress"}
      </span>
    `;
    certsGrid.appendChild(card);
  });
}

/* ===== RENDER PROJECTS ===== */
const grid = document.getElementById("projects-grid");
if (grid) {
  projects.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "project-card reveal";
    card.style.transitionDelay = `${i * 80}ms`;
    card.innerHTML = `
      <div class="project-tag">${p.tag}</div>
      <h3 class="project-title">${p.title}</h3>
      <p class="project-desc">${p.desc}</p>
      <div class="project-stack">
        ${p.stack.map(s => `<span>${s}</span>`).join("")}
      </div>
      ${p.wip ? '<div class="project-wip">⏳ Work in Progress</div>' : ""}
    `;
    card.addEventListener("click", () => { if (p.link !== "#") window.open(p.link, "_blank"); });
    grid.appendChild(card);
  });
}

/* ===== NAV SCROLL ===== */
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 60);
});

/* ===== INTERSECTION OBSERVER ===== */
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.1 }
);

// Observe static reveals
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Observe dynamically injected cards
setTimeout(() => {
  document.querySelectorAll(".cert-card.reveal, .project-card.reveal").forEach(el => observer.observe(el));
}, 80);

/* ===== ANIMATE SKILL BARS on scroll ===== */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll(".fill").forEach(bar => {
        const w = bar.style.width;
        bar.style.width = "0%";
        requestAnimationFrame(() => { bar.style.width = w; });
      });
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

const skillsSection = document.getElementById("skills");
if (skillsSection) barObserver.observe(skillsSection);

/* ===== CONTACT FORM (Formspree — no backend needed) =====
   SETUP (one time, free):
   1. Go to https://formspree.io and sign up with your email
   2. Click "New Form" → give it any name → copy the form endpoint URL
   3. Replace YOUR_FORM_ID below with your actual ID (e.g. xpzgkrjv)
   Every message will be emailed directly to you. That's it!
======================================================== */
const FORMSPREE_URL = "https://formspree.io/f/xqenglev"; // 

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector(".btn-submit");
    btn.disabled = true;
    btn.textContent = "Sending...";
    status.textContent = "";

    const data = new FormData(form);

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: data,
        headers: { "Accept": "application/json" }
      });

      if (res.ok) {
        status.textContent = "✓ Message sent! I'll reply soon 😊";
        status.style.color = "#7ab87a";
        form.reset();
      } else {
        const json = await res.json();
        // Formspree not configured yet — show helpful message
        if (json.errors) {
          status.textContent = "⚠️ Form not set up yet. Please replace YOUR_FORM_ID in script.js";
        } else {
          throw new Error();
        }
      }
    } catch {
      status.textContent = "Something went wrong. Email me directly instead!";
      status.style.color = "#c9a84c";
    } finally {
      btn.disabled = false;
      btn.textContent = "Send Message →";
    }
  });
}

/* ===== SMOOTH SCROLL with nav offset ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  });
});
