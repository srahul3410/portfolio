const CERTS = [
  { type: "img", file: "image/Python%20Coder%20(1).png", kind: "Course", title: "Python Programming" },
  { type: "pdf", file: "image/SIH_2026_Certificate_Rahul%20Singh.pdf", kind: "Hackathon", title: "Smart India Hackathon 2026" },
  { type: "pdf", file: "image/gmf3ypEXBj2wvfQWC_ifobHAoMjQs9s6bKS_mPfeKq6t2S43Dwoyh_1781537291070_completion_certificate.pdf", kind: "Job Simulation", title: "Tata Cybersecurity Analyst" },
  { type: "pdf", file: "image/skillup.pdf", kind: "Course", title: "Generative AI Literacy" },
  { type: "img", file: "image/sql.jpg", kind: "Course", title: "SQL and Relational Databases 101" },
  { type: "img",file:"image/workshop.jpg", kind: "Workshop", title: "Cybersecurity Workshop" },
  { type: "none", kind: "Course", title: "Certificate 07" },
  { type: "none", kind: "Course", title: "Certificate 08" }
];

const stage = document.getElementById("ccStage");
const dotsEl = document.getElementById("ccDots");
const box = document.getElementById("ccBox");
const boxBody = document.getElementById("ccBoxBody");
const N = CERTS.length;
let active = Math.floor(N / 2), timer = null;

const cards = CERTS.map((c, i) => {
  const el = document.createElement("div");
  el.className = "cc-card";
  el.tabIndex = 0;
  el.setAttribute("role", "button");
  el.setAttribute("aria-label", c.title);

  let preview;
  if (c.type === "img") {
    preview = document.createElement("img");
    preview.src = c.file; preview.alt = c.title; preview.loading = "lazy";
  } else if (c.type === "pdf") {
    preview = document.createElement("iframe");
    preview.src = c.file + "#toolbar=0&navpanes=0&view=Fit&scrollbar=0";
    preview.title = c.title; preview.tabIndex = -1;
  } else {
    preview = document.createElement("div");
    preview.className = "cc-ph mono";
    preview.textContent = c.title;
  }
  preview.classList.add("cc-prev");

  const kind = document.createElement("div");
  kind.className = "mono cc-kind"; kind.textContent = "· " + c.kind;
  const h = document.createElement("h3");
  h.className = "serif"; h.textContent = c.title;

  el.append(preview, kind, h);
  el.addEventListener("click", () => {
    if (i !== active) { go(i); restart(); }
    else if (c.type !== "none") openBox(c);
  });
  el.addEventListener("keydown", e => {
    if (e.key === "Enter") el.click();
  });
  stage.appendChild(el);

  const dot = document.createElement("button");
  dot.type = "button"; dot.className = "cc-dot";
  dot.setAttribute("aria-label", "Show " + c.title);
  dot.onclick = () => { go(i); restart(); };
  dotsEl.appendChild(dot);
  return el;
});
const dots = [...dotsEl.children];

function offsetOf(i) {
  let d = i - active;
  if (d > N / 2) d -= N;
  if (d < -N / 2) d += N;
  return d;
}

function render() {
  const step = innerWidth < 800 ? 60 : 170;
  cards.forEach((el, i) => {
    const d = offsetOf(i), a = Math.abs(d);
    const rot = Math.max(-16, Math.min(16, -d * 6));
    const scale = a === 0 ? 1 : Math.max(.72, 1 - a * .1);
    el.style.transform =
      `translateX(calc(-50% + ${d * step}px)) translateY(${a * 8}px) rotateY(${rot}deg) scale(${scale})`;
    el.style.zIndex = 100 - a;
    el.style.opacity = a > 2 ? 0 : 1;
    el.style.pointerEvents = a > 2 ? "none" : "auto";
    el.classList.toggle("is-active", a === 0);
    dots[i].classList.toggle("on", a === 0);
  });
}

function go(i) { active = (i + N) % N; render(); }
function restart() {
  clearInterval(timer);
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && box.hidden)
    timer = setInterval(() => go(active + 1), 3200);
}

function openBox(c) {
  clearInterval(timer);
  boxBody.innerHTML = "";
  let el;
  if (c.type === "img") { el = document.createElement("img"); el.src = c.file; el.alt = c.title; }
  else { el = document.createElement("iframe"); el.src = c.file; el.title = c.title; }
  const open = document.createElement("a");
  open.href = c.file; open.target = "_blank"; open.rel = "noopener";
  open.className = "gh mono"; open.textContent = "Open in new tab ↗";
  boxBody.append(el, open);
  box.hidden = false;
}
function closeBox() { box.hidden = true; boxBody.innerHTML = ""; restart(); }

document.getElementById("ccPrev").onclick = () => { go(active - 1); restart(); };
document.getElementById("ccNext").onclick = () => { go(active + 1); restart(); };
document.getElementById("ccClose").onclick = closeBox;
box.addEventListener("click", e => { if (e.target === box) closeBox(); });
addEventListener("keydown", e => {
  if (!box.hidden) { if (e.key === "Escape") closeBox(); return; }
  if (document.activeElement === stage || stage.contains(document.activeElement)) {
    if (e.key === "ArrowLeft") { go(active - 1); restart(); }
    if (e.key === "ArrowRight") { go(active + 1); restart(); }
  }
});
stage.addEventListener("mouseenter", () => clearInterval(timer));
stage.addEventListener("mouseleave", restart);

// mobile swipe
let sx = null;
stage.addEventListener("touchstart", e => { sx = e.touches[0].clientX; clearInterval(timer); }, { passive: true });
stage.addEventListener("touchend", e => {
  if (sx === null) return;
  const dx = e.changedTouches[0].clientX - sx;
  if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
  sx = null; restart();
});

addEventListener("resize", render);
render();
restart();