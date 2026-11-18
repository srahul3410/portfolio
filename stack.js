// ===== Apni tools ki list yahan badlo =====
// name = niche ka naam | logo = image/logos/ folder ki file
// full: true = logo khud poora tile hai (Lightroom, CapCut, VN jaise), warna white tile par logo dikhega
const L = "image/logos/";
const W = "image/logos/white/";
// Do tarah ke tiles:
//  1) bg: ["#rang1","#rang2"] = rangeen gradient tile par safed logo (logos/white/ ka mono logo)
//  2) bg nahi = safed tile par apna rangeen logo (koi bhi png / jpg / svg)
//  full: true = image khud poora tile hai
const TOOLS = [
  { name: "Python",     logo: W + "python.svg",     bg: ["#4f8fcf", "#2b5b9a"] },
  { name: "C++",        logo: W + "cplusplus.svg",  bg: ["#1fb3f0", "#00599c"] },
  { name: "C",          logo: W + "c.svg",          bg: ["#6f9fe0", "#1f4f9c"] },
  { name: "HTML",       logo: W + "html5.svg",      bg: ["#ff8a3d", "#e34f26"] },
  { name: "CSS",        logo: W + "css.svg",        bg: ["#5a6bff", "#2a2fb8"] },
  { name: "JavaScript", logo: W + "javascript.svg", bg: ["#ffe14d", "#f0b400"] },
  { name: "Node.js",    logo: W + "nodejs.svg",     bg: ["#7bd36a", "#2f7d2b"] },
  { name: "MySQL",      logo: W + "mysql.svg",      bg: ["#4aa3c7", "#1f5f8b"] },
  { name: "SQLite",     logo: W + "sqlite.svg",     bg: ["#4fc3f7", "#0b6fa4"] },
  { name: "Flask",      logo: W + "flask.svg",      bg: ["#4a4d54", "#17181b"] },

  { name: "Linux",      logo: W + "linux.svg",      bg: ["#4a4d54", "#17181b"] },
  { name: "Git",        logo: W + "git.svg",        bg: ["#ff7a59", "#f05032"] },
  { name: "GitHub",     logo: W + "github.svg",     bg: ["#6e5494", "#2b1f4d"] },
  { name: "VS Code",    logo: W + "vscode.svg",     bg: ["#3aa0ff", "#0065a9"] },
  { name: "Postman",    logo: W + "postman.svg",    bg: ["#ff8a5b", "#e8501d"] },
  { name: "Tailwind",   logo: W + "tailwind.svg",   bg: ["#38e0e8", "#0a8fa6"] },
  { name: "Figma",      logo: W + "figma.svg",      bg: ["#a259ff", "#f24e1e"] },
  { name: "Canva",      logo: L + "canva-tile.svg",     full: true },
  { name: "Photoshop",  logo: L + "photoshop-tile.svg", full: true },
  { name: "Lightroom",  logo: L + "lightroom.svg",  full: true },

  { name: "Blender",    logo: W + "blender.svg",    bg: ["#ffa94d", "#e87d0d"] },
  { name: "CapCut",     logo: L + "capcut.svg",     full: true },
  { name: "VN",         logo: L + "vn.png",         full: true },
  { name: "Google Ads", logo: W + "googleads.svg",  bg: ["#4f93ff", "#1a5fd0"] },
  { name: "Gemini",     logo: W + "gemini.svg",     bg: ["#4285f4", "#9b72cb", "#d96570"] },
  { name: "Prompting",  logo: L + "prompting.svg",   full: true },
  { name: "Vibe Coding",logo: L + "vibe-coding.svg", full: true },
  { name: "Nmap",       logo: L + "nmap.png",        full: true },
  { name: "Wireshark",  logo: W + "wireshark.svg",  bg: ["#3a9bd0", "#0d4a6b"] },
  { name: "Burp Suite", logo: W + "burpsuite.svg",  bg: ["#ff7a45", "#d93f0b"] }
];

// logo ko dhundhta hai: diye gaye path se, phir image/logos/, logos/, image/ aur root me,
// aur extension .svg .png .jpg .jpeg .webp bhi try karta hai
function loadLogo(img, path, onFail) {
  const file = path.split("/").pop();
  const stem = file.replace(/\.(svg|png|jpe?g|webp)$/i, "");
  const dirs = [path.slice(0, path.length - file.length), "image/logos/", "logos/", "image/", ""];
  const names = [file, ...["svg", "png", "jpg", "jpeg", "webp"].map(e => stem + "." + e)];
  const tries = [];
  names.forEach(n => dirs.forEach(d => tries.push(d + n)));
  const list = tries.filter((p, i) => tries.indexOf(p) === i);
  let n = 0;
  img.onerror = () => { n++; if (n < list.length) img.src = list[n]; else { img.remove(); onFail(); } };
  img.onload = () => { if (n > 0) console.info("Logo mila:", list[n], "(list me path alag likha tha:", path + ")"); };
  img.src = list[0];
}

(() => {
  const NUM = ["Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
    "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen",
    "Twenty","Twenty-one","Twenty-two","Twenty-three","Twenty-four","Twenty-five","Twenty-six",
    "Twenty-seven","Twenty-eight","Twenty-nine","Thirty"];

  const panel = document.getElementById("stackPanel");
  const grid  = document.getElementById("stackGrid");
  const gift  = document.getElementById("stackGift");
  const count = document.getElementById("stackCount");
  const hint  = document.getElementById("stackHint");
  const stage = document.getElementById("stackStage");
  if (!panel || !grid || !gift) return;

  count.textContent = NUM[TOOLS.length] || String(TOOLS.length);

  // ---- tiles banao ----
  const tiles = TOOLS.map(t => {
    const tile = document.createElement("div");
    tile.className = "tile";
    const icon = document.createElement("div");
    icon.className = "tile-icon" + (t.full ? " full" : "") + (t.bg ? " glyph" : "");
    if (t.bg) icon.style.setProperty("--bg", t.bg.join(","));
    const img = new Image();
    img.alt = ""; img.draggable = false;
    loadLogo(img, t.logo, () => {            // koi bhi file na mile to naam ka text dikhao
      icon.classList.add("missing");
      icon.textContent = t.name.slice(0, 3);
      console.warn("Logo nahi mila:", t.logo, "→ image/logos/ me file ka naam aur extension check karo");
    });
    icon.appendChild(img);
    const name = document.createElement("div");
    name.className = "tile-name";
    name.textContent = t.name;
    tile.append(icon, name);
    grid.appendChild(tile);
    return tile;
  });

  // heading ki highlighter swipe screen par aane par chalti hai
  const io = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) { panel.classList.add("in-view"); io.disconnect(); }
  }, { threshold: 0.35 });
  io.observe(panel);

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch  = matchMedia("(hover: none)").matches;
  if (hint) hint.textContent = touch ? "Tap the icons to unwrap" : "Hover over the icons to unwrap";
  if (reduce) { panel.classList.add("in-view"); if (hint) hint.hidden = true; return; }

  // ---- animation ----
  let running = [];
  const clear = () => { running.forEach(a => a.cancel()); running = []; };

  function targets() {
    const g = gift.querySelector("svg").getBoundingClientRect();
    const gx = g.left + g.width / 2, gy = g.top + g.height * 0.3;
    return tiles.map(tile => {
      const r = tile.getBoundingClientRect();
      const dx = gx - (r.left + r.width / 2), dy = gy - (r.top + r.height / 2);
      return { dx, dy, dist: Math.hypot(dx, dy) };
    });
  }

  function setActive(on) {
    panel.classList.toggle("is-active", on);
    panel.classList.toggle("is-open", on);
  }

  // icons gift box me kheench jaate hain (box ke paas wale pehle, door wale baad me)
  function flyIn() {
    clear();
    const T = targets();
    const rank = [...T.keys()].sort((a, b) => T[a].dist - T[b].dist);
    setActive(true);
    const anims = tiles.map((tile, i) => {
      const { dx, dy } = T[i];
      const side = (i % 2 ? 1 : -1) * 26;
      return tile.animate([
        { transform: "translate(0,0) scale(1) rotate(0deg)", opacity: 1 },
        { transform: `translate(${dx * .5 + side}px,${dy * .5 - 34}px) scale(.62) rotate(${side}deg)`, opacity: 1, offset: .55 },
        { transform: `translate(${dx}px,${dy}px) scale(.12) rotate(${side * 2}deg)`, opacity: 0 }
      ], { duration: 720, delay: rank.indexOf(i) * 32, easing: "cubic-bezier(.5,0,.9,.5)", fill: "both" });
    });
    running = anims;
    return Promise.all(anims.map(a => a.finished));
  }

  // icons box se spring ke saath bahar aate hain (upar ki row pehle)
  function flyOut() {
    clear();
    const T = targets();
    setActive(true);
    const anims = tiles.map((tile, i) => {
      const { dx, dy } = T[i];
      const side = (i % 2 ? 1 : -1) * 22;
      return tile.animate([
        { transform: `translate(${dx}px,${dy}px) scale(.12) rotate(${-side * 2}deg)`, opacity: 0 },
        { transform: `translate(${dx * .4 - side}px,${dy * .4 - 24}px) scale(.8) rotate(${-side}deg)`, opacity: 1, offset: .45 },
        { transform: "translate(0,0) scale(1) rotate(0deg)", opacity: 1 }
      ], { duration: 900, delay: i * 38, easing: "cubic-bezier(.2,.9,.3,1.12)", fill: "both" });
    });
    running = anims;
    return Promise.all(anims.map(a => a.finished)).then(() => { clear(); setActive(false); });
  }

  // ---- cursor se control: icons ke upar cursor laao to sab gift me jaate hain, hataoge to bahar aate hain ----
  let want = false, state = false, busy = false;
  async function sync() {
    if (busy) return;
    busy = true;
    try {
      while (state !== want) {
        if (want) { await flyIn(); state = true; }
        else      { await flyOut(); state = false; }
      }
    } finally { busy = false; }
  }
  function set(v) {
    want = v;
    gift.setAttribute("aria-pressed", String(v));
    sync();
  }

  stage.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") set(true); });
  stage.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") set(false); });
  // touch aur keyboard (gift par Enter / Space) ke liye: tap karne par toggle
  stage.addEventListener("click", e => { if (e.pointerType !== "mouse") set(!want); });
})();