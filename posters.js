(() => {
  const section = document.getElementById("posters");
  if (!section) return;

  const track = document.getElementById("posterTrack");
  const cards = [...track.querySelectorAll(".poster-card")];
  const prev = document.getElementById("posterPrev");
  const next = document.getElementById("posterNext");
  const count = section.querySelector(".poster-count");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let active = 0, timer = null, frame = 0, inView = true, paused = false;

  function nearest() {
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0, distance = Infinity;
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const delta = Math.abs(cardCenter - center);
      if (delta < distance) { distance = delta; best = i; }
    });
    return best;
  }

  function paint() {
    frame = 0;
    const center = track.scrollLeft + track.clientWidth / 2;
    const centerIndex = nearest();
    cards.forEach((card, i) => {
      const distance = (card.offsetLeft + card.offsetWidth / 2 - center) / card.offsetWidth;
      const amount = Math.min(Math.abs(distance), 1.5);
      const tilt = Math.max(-1, Math.min(1, -distance)) * Math.min(amount, 1) * 8;
      card.style.transform = `translateY(${amount * 8}px) rotateY(${tilt}deg)`;
      card.style.opacity = String(1 - amount * .2);
      card.classList.toggle("is-active", i === centerIndex);
    });
    active = centerIndex;
    count.textContent = `${String(active + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
  }

  function go(index) {
    active = (index + cards.length) % cards.length;
    const card = cards[active];
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
      behavior: reduceMotion ? "auto" : "smooth"
    });
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  function start() {
    stop();
    if (!reduceMotion && !paused && inView && !document.hidden && cards.length > 1)
      timer = setInterval(() => go(active + 1), 3600);
  }

  track.addEventListener("scroll", () => {
    if (!frame) frame = requestAnimationFrame(paint);
  }, { passive: true });
  prev.addEventListener("click", () => { go(active - 1); start(); });
  next.addEventListener("click", () => { go(active + 1); start(); });
  track.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") { event.preventDefault(); go(active - 1); start(); }
    if (event.key === "ArrowRight") { event.preventDefault(); go(active + 1); start(); }
  });

  track.addEventListener("mouseenter", () => { paused = true; stop(); });
  track.addEventListener("mouseleave", () => { paused = false; start(); });
  track.addEventListener("focusin", () => { paused = true; stop(); });
  track.addEventListener("focusout", event => {
    if (!track.contains(event.relatedTarget)) { paused = false; start(); }
  });
  track.addEventListener("touchstart", stop, { passive: true });
  track.addEventListener("touchend", start, { passive: true });
  document.addEventListener("visibilitychange", start);
  addEventListener("resize", () => { go(active); paint(); });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      start();
    });
    observer.observe(section);
  }

  section.querySelectorAll(".poster-frame img").forEach(image => {
    const frame = image.closest(".poster-frame");
    image.addEventListener("load", () => frame.classList.remove("is-missing"));
    image.addEventListener("error", () => frame.classList.add("is-missing"));
    if (image.complete && !image.naturalWidth) frame.classList.add("is-missing");
  });

  paint();
  start();
})();
