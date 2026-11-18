// Projects carousel: arrows, drag, keyboard aur center card ka 3D tilt
(() => {
  const track = document.getElementById("pjTrack");
  if (!track) return;
  const cards = [...track.querySelectorAll(".pj-card")];
  const prev = document.getElementById("pjPrev");
  const next = document.getElementById("pjNext");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let idx = 0, raf = 0;

  const centerOf = i => cards[i].offsetLeft - (track.clientWidth - cards[i].offsetWidth) / 2;

  function nearest() {
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0, bd = Infinity;
    cards.forEach((el, i) => {
      const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
      if (d < bd) { bd = d; best = i; }
    });
    return best;
  }

  function paint() {
    raf = 0;
    const mid = track.scrollLeft + track.clientWidth / 2;
    cards.forEach(el => {
      const d = (el.offsetLeft + el.offsetWidth / 2 - mid) / el.offsetWidth;   // card widths door
      const a = Math.min(Math.abs(d), 1.6);
      const tilt = Math.max(-1, Math.min(1, -d)) * Math.min(a, 1) * 14;
      el.style.transform = `translateY(${a * 10}px) rotateY(${tilt}deg) scale(${1 - a * .07})`;
      el.style.opacity = String(1 - a * .2);
    });
    idx = nearest();
    prev.disabled = idx === 0;
    next.disabled = idx === cards.length - 1;
    cards.forEach((el, i) => el.classList.toggle("is-active", i === idx));
  }

  const go = i => track.scrollTo({
    left: centerOf(Math.max(0, Math.min(cards.length - 1, i))),
    behavior: reduce ? "auto" : "smooth"
  });

  track.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(paint); }, { passive: true });
  prev.addEventListener("click", () => go(idx - 1));
  next.addEventListener("click", () => go(idx + 1));
  track.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft")  { e.preventDefault(); go(idx - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(idx + 1); }
  });

  // mouse se drag karke bhi chala sakte ho
  let down = false, moved = false, sx = 0, sl = 0;
  track.addEventListener("pointerdown", e => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    down = true; moved = false; sx = e.clientX; sl = track.scrollLeft;
    track.classList.add("drag");
  });
  addEventListener("pointermove", e => {
    if (!down) return;
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 4) moved = true;
    track.scrollLeft = sl - dx;
  });
  addEventListener("pointerup", () => {
    if (!down) return;
    down = false;
    track.classList.remove("drag");
    go(nearest());
  });
  track.addEventListener("click", e => {          // drag ke baad galti se link na khule
    if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
  }, true);

  addEventListener("resize", () => { track.scrollLeft = centerOf(idx); paint(); });
  track.scrollLeft = centerOf(0);
  paint();
})();