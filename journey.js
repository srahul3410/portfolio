(() => {
  const stage = document.getElementById("flightStage");
  const route = document.getElementById("flightRoute");
  const plane = document.getElementById("flightPlane");
  const detail = document.getElementById("milestoneDetail");
  if (!stage || !route || !plane || !detail) return;

  const milestones = [
    { date: "2025", title: "Joined SRMU · B.Tech CSE", text: "Built my foundation in computer science and began learning Python and web development.", x: 40, y: 125 },
    { date: "Early 2026", title: "First hackathon", text: "Learned rapid prototyping, teamwork, and thoughtful UI/UX while building under pressure.", x: 360, y: 125 },
    { date: "Mid 2026", title: "SIH University Qualifier · VidyaSetu", text: "Worked on VidyaSetu, an AI-powered platform designed to bridge skill gaps between students and industry.", x: 950, y: 250 },
    { date: "Late 2026", title: "IIT Bombay Hackathon", text: "Taking on advanced problem-solving with AI flashcards, APIs, and collaborative building.", x: 680, y: 375 },
    { date: "Future", title: "AI innovations & full stack", text: "Building production-ready AI systems, deploying to the cloud, and continuing to learn by making.", x: 100, y: 375 }
  ];
  const nodes = [...stage.querySelectorAll(".milestone-node")];
  const path = route.querySelector(".flight-route-line");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const totalLength = path.getTotalLength();
  const pathSamples = Array.from({ length: 401 }, (_, i) => {
    const length = totalLength * i / 400;
    return { length, point: path.getPointAtLength(length) };
  });
  let active = 0, currentLength = 0, animationFrame = 0, timer = null;
  let gestureReadyAt = 0, wheelAmount = 0, wheelDirection = 0;

  function closestPathLength(point) {
    let bestLength = 0, bestDistance = Infinity;
    pathSamples.forEach(sample => {
      const dx = sample.point.x - point.x;
      const dy = sample.point.y - point.y;
      const distance = dx * dx + dy * dy;
      if (distance < bestDistance) { bestDistance = distance; bestLength = sample.length; }
    });
    return bestLength;
  }

  const milestoneLengths = milestones.map(closestPathLength);

  function drawPlane(length) {
    currentLength = Math.max(0, Math.min(totalLength, length));
    const point = path.getPointAtLength(currentLength);
    const before = path.getPointAtLength(Math.max(0, currentLength - 1));
    const after = path.getPointAtLength(Math.min(totalLength, currentLength + 1));
    const sx = stage.clientWidth / 1000, sy = stage.clientHeight / 500;
    const angle = Math.atan2((after.y - before.y) * sy, (after.x - before.x) * sx) * 180 / Math.PI;
    const angleBefore = Math.atan2((point.y - before.y) * sy, (point.x - before.x) * sx);
    const angleAfter = Math.atan2((after.y - point.y) * sy, (after.x - point.x) * sx);
    const turn = Math.atan2(Math.sin(angleAfter - angleBefore), Math.cos(angleAfter - angleBefore));
    const bank = Math.max(-18, Math.min(18, turn * 2.8 * 180 / Math.PI));

    plane.style.left = `${point.x * sx}px`;
    plane.style.top = `${point.y * sy}px`;
    plane.style.transform = `translate(-50%, -50%) rotate(${angle}deg) rotateY(${bank}deg)`;
  }

  function placeDetail(index) {
    const stageRect = stage.getBoundingClientRect();
    const dotRect = nodes[index].querySelector(".node-dot").getBoundingClientRect();
    const width = detail.offsetWidth;
    const height = detail.offsetHeight;
    const centerX = dotRect.left + dotRect.width / 2 - stageRect.left;
    const centerY = dotRect.top + dotRect.height / 2 - stageRect.top;
    const left = Math.max(10, Math.min(stage.clientWidth - width - 10, centerX - width / 2));
    const below = centerY + height + 18 <= stage.clientHeight;
    const top = below
      ? Math.min(stage.clientHeight - height - 8, centerY + 18)
      : Math.max(8, centerY - height - 18);

    detail.style.left = `${left}px`;
    detail.style.top = `${top}px`;
    detail.style.setProperty("--pointer-x", `${Math.max(14, Math.min(width - 24, centerX - left))}px`);
    detail.classList.toggle("is-above", !below);
  }

  function updateMilestone(index) {
    active = (index + milestones.length) % milestones.length;
    const milestone = milestones[active];
    nodes.forEach((node, i) => {
      const selected = i === active;
      node.classList.toggle("is-active", selected);
      if (selected) node.setAttribute("aria-current", "step");
      else node.removeAttribute("aria-current");
    });
    detail.querySelector(".milestone-detail-date").textContent = milestone.date;
    detail.querySelector("h3").textContent = milestone.title;
    detail.querySelector("p").textContent = milestone.text;
    detail.setAttribute("aria-label", `${milestone.date}: ${milestone.title}`);
  }

  function revealMilestone(index) {
    if (index !== active) return;
    placeDetail(index);
    detail.classList.add("is-visible");
    detail.setAttribute("aria-hidden", "false");
  }

  function moveTo(index, onArrival) {
    const target = milestoneLengths[index];
    cancelAnimationFrame(animationFrame);
    if (reducedMotion) {
      drawPlane(target);
      onArrival();
      return;
    }

    const from = currentLength;
    const started = performance.now();
    const duration = 1250;

    function animate(now) {
      const progress = Math.min(1, (now - started) / duration);
      const eased = progress < .5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      drawPlane(from + (target - from) * eased);
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
      else onArrival();
    }

    animationFrame = requestAnimationFrame(animate);
  }

  function scheduleAutoplay() {
    clearTimeout(timer);
    if (!reducedMotion && !document.hidden)
      timer = setTimeout(() => select(active + 1), 4800);
  }

  function select(index) {
    clearTimeout(timer);
    updateMilestone(index);
    detail.classList.remove("is-visible");
    detail.setAttribute("aria-hidden", "true");
    moveTo(active, () => {
      revealMilestone(active);
      scheduleAutoplay();
    });
  }

  function navigate(direction) {
    select(active + direction);
  }

  nodes.forEach((node, index) => node.addEventListener("click", () => select(index)));

  stage.addEventListener("keydown", event => {
    const directions = {
      ArrowUp: -1,
      ArrowRight: -1,
      ArrowDown: 1,
      ArrowLeft: 1
    };
    if (!(event.key in directions)) return;
    event.preventDefault();
    navigate(directions[event.key]);
  });

  const wheelSurface = document.getElementById("journey") || stage;
  wheelSurface.addEventListener("wheel", event => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || !event.deltaX) return;
    const now = performance.now();
    if (now < gestureReadyAt) return;
    const direction = event.deltaX > 0 ? 1 : -1;
    if (direction !== wheelDirection) wheelAmount = 0;
    wheelDirection = direction;
    wheelAmount += Math.abs(event.deltaX);
    if (wheelAmount < 45) return;
    wheelAmount = 0;
    gestureReadyAt = now + 650;
    navigate(direction);
  }, { passive: true });

  let touchStart = null;
  stage.addEventListener("touchstart", event => {
    const touch = event.touches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  stage.addEventListener("touchend", event => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    touchStart = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 45) return;
    navigate(Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : -1) : (dy > 0 ? 1 : -1));
  }, { passive: true });

  document.addEventListener("visibilitychange", scheduleAutoplay);
  addEventListener("resize", () => {
    drawPlane(milestoneLengths[active]);
    if (detail.classList.contains("is-visible")) placeDetail(active);
  });

  updateMilestone(active);
  detail.setAttribute("aria-hidden", "true");
  drawPlane(milestoneLengths[active]);
  revealMilestone(active);
  scheduleAutoplay();
})();
