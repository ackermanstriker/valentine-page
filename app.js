// ================= CONFIG =================
const CFG = window.APP_CONFIG;

const RESET_MS = CFG.RESET_MS;
const maxDodge = CFG.MAX_DODGE;
const NO_CLICK_LIMIT = CFG.NO_CLICK_LIMIT;

const dodgeTexts = CFG.DODGE_TEXTS;
const noClickMessages = CFG.NO_CLICK_MESSAGES;

const SUNSET_HUES = CFG.SUNSET_HUES;

// ================= Personalization via URL =================
const params = new URLSearchParams(location.search);
const personName = params.get("name");
const fromName = params.get("from");
const customQ = params.get("q");
const customYes = params.get("yes");

if (personName) document.getElementById("name").textContent = personName;
if (customQ) document.getElementById("question").innerHTML = customQ;
if (customYes) document.getElementById("yayMsg").textContent = customYes;

const tiny = document.getElementById("tinyLine");
if (fromName) tiny.innerHTML = `— from <b>${fromName}</b>`;

// ================= Elements =================
const noBtn = document.getElementById("noBtn");
const noZone = document.getElementById("noZone");
const yesBtn = document.getElementById("yesBtn");

const result = document.getElementById("result");
const yayTitle = document.getElementById("yayTitle");
const yayMsg = document.getElementById("yayMsg");

// ================= State =================
let dodgeLevel = 0;
let lastNoTextIndex = -1;

let yesCount = 0;
let dodgeEnabled = true;
let noClickCount = 0;

// Start in dodge visual state
noBtn.classList.add("blocked");
let lastPos = { x: null, y: null };

// ================= Helpers =================
function resetNoButtonPosition() {
  noBtn.style.position = "";
  noBtn.style.left = "";
  noBtn.style.top = "";
  lastPos = { x: null, y: null };
}

function resetDodgeState() {
  dodgeLevel = 0;
  lastNoTextIndex = -1;
}

function resetUI({ enableDodge = true, hideResult = true } = {}) {
  if (hideResult) result.classList.remove("show");

  resetNoButtonPosition();
  resetDodgeState();
  dodgeEnabled = enableDodge;

  if (enableDodge) {
    noBtn.disabled = false;
    noBtn.classList.add("blocked");
    noBtn.textContent = "No 🙈";
  } else {
    noBtn.classList.remove("blocked");
  }
}

function lockEverythingFinal() {
  dodgeEnabled = false;

  resetNoButtonPosition();

  noBtn.textContent = "No 🙈";
  noBtn.classList.remove("blocked");

  yesBtn.disabled = true;
  noBtn.disabled = true;

  result.classList.add("show");
  yayTitle.textContent = CFG.FINAL_TITLE;
  yayMsg.textContent = CFG.FINAL_MSG;
}

function temporarilyDisableYes(duration = RESET_MS) {
  yesBtn.disabled = true;

  setTimeout(() => {
    if (!noBtn.disabled) yesBtn.disabled = false;
  }, duration);
}

// ================= NO Movement =================
function moveNoButton() {
  const zoneRect = noZone.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  const padding = 8;

  const minX = padding;
  const minY = padding;
  const maxX = Math.max(minX, zoneRect.width - btnRect.width - padding);
  const maxY = Math.max(minY, zoneRect.height - btnRect.height - padding);

  // If the zone is tiny, just place it normally
  if (maxX === minX && maxY === minY) {
    noBtn.style.position = "absolute";
    noBtn.style.left = minX + "px";
    noBtn.style.top = minY + "px";
    return;
  }

  // Minimum jump distance (bigger on mobile)
  const isMobile = window.matchMedia("(max-width: 430px)").matches;
  const minJump = isMobile ? 70 : 40;

  let x, y, tries = 0;

  do {
    x = Math.random() * (maxX - minX) + minX;
    y = Math.random() * (maxY - minY) + minY;
    tries++;

    if (lastPos.x === null) break;

    const dx = x - lastPos.x;
    const dy = y - lastPos.y;
    const dist = Math.hypot(dx, dy);

    // try again if too close (but don't loop forever)
    if (dist >= minJump) break;

  } while (tries < 12);

  lastPos = { x, y };

  noBtn.style.position = "absolute";
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
}


function updateNoTextForDodge() {
  if (dodgeTexts.length === 1) {
    noBtn.textContent = dodgeTexts[0];
    return;
  }

  let idx;
  do {
    idx = Math.floor(Math.random() * dodgeTexts.length);
  } while (idx === lastNoTextIndex);

  lastNoTextIndex = idx;
  noBtn.textContent = dodgeTexts[idx];
}

// ================= Dodge Behavior =================
function dodge() {
  if (!dodgeEnabled) return;
  if (dodgeLevel >= maxDodge) return;

  dodgeLevel++;
  updateNoTextForDodge();

  // let the browser apply the new text width before measuring
  requestAnimationFrame(() => {
    moveNoButton();

    if (dodgeLevel === maxDodge) {
      noBtn.classList.remove("blocked");
    }
  });
}


noBtn.addEventListener("mouseenter", dodge);
noBtn.addEventListener("touchstart", dodge, { passive: true });

// ================= YES Behavior =================
yesBtn.addEventListener("click", () => showResult(true));

function showResult(isYes) {
  result.classList.add("show");
  if (!isYes) return;

  yesCount++;

  // First YES
  if (yesCount === 1) {
    resetNoButtonPosition();
    resetDodgeState();
    dodgeEnabled = false;

    noBtn.classList.remove("blocked");
    noBtn.disabled = false;

    yayTitle.textContent = CFG.YES1_TITLE;
    yayMsg.textContent = CFG.YES1_MSG;
    noBtn.textContent = CFG.TEASE_LABEL;

    popConfetti();
    return;
  }

  // Second YES+
  if (yesCount >= 2) {
    resetNoButtonPosition();
    resetDodgeState();
    dodgeEnabled = false;

    noBtn.classList.remove("blocked");

    yayTitle.textContent = CFG.YES2_TITLE;
    yayMsg.textContent = CFG.YES2_MSG;

    noBtn.textContent = "NO BACKSIES";
    noBtn.disabled = true;

    popConfetti();
  }
}

// ================= NO Click Behavior =================
noBtn.addEventListener("click", () => {
  if (noBtn.disabled || yesBtn.disabled) return;

  if (dodgeEnabled && dodgeLevel < maxDodge) return;

  temporarilyDisableYes();

  // Tease mode click
  if (
    yesCount === 1 &&
    !dodgeEnabled &&
    noBtn.textContent.includes("tease")
  ) {
    result.classList.add("show");
    yayTitle.textContent = CFG.TEASE_TITLE;
    yayMsg.textContent = CFG.TEASE_MSG;

    setTimeout(() => {
      resetUI({ enableDodge: true, hideResult: true });
    }, RESET_MS);

    return;
  }

  // Normal NO click
  noClickCount++;

  const msgIndex = Math.min(noClickCount - 1, noClickMessages.length - 1);
  result.classList.add("show");
  yayTitle.textContent = "";
  yayMsg.textContent = noClickMessages[msgIndex];

  if (noClickCount >= NO_CLICK_LIMIT) {
    lockEverythingFinal();
    return;
  }

  setTimeout(() => {
    resetUI({ enableDodge: true, hideResult: true });
  }, RESET_MS);
});

// ================= Confetti =================
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let confetti = [];

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
addEventListener("resize", resize);
resize();

// --- Sunset Sparkles (theme-appropriate) ---
let particles = [];
let animRunning = false;


function popConfetti() {
  // burst from roughly the center of the card
  const cardRect = document.getElementById("card").getBoundingClientRect();
  const cx = cardRect.left + cardRect.width / 2;
  const cy = cardRect.top + cardRect.height / 2;

  const count = 150;
  const sunsetHues = [18, 24, 30, 36, 300, 285]; // orange -> peach + a hint of purple

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.4 + Math.random() * 3.6;

    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      drag: 0.985,
      gravity: 0.012 + Math.random() * 0.015,   // gentle downward drift
      r: 1.4 + Math.random() * 3.6,
      hue: sunsetHues[Math.floor(Math.random() * sunsetHues.length)],
      a: 0.9,
      life: 130 + Math.random() * 90,
      maxLife: 220,
      tw: Math.random() * 2 * Math.PI,       // twinkle phase
      glow: 8 + Math.random() * 14
    });
  }

  if (!animRunning) {
    animRunning = true;
    requestAnimationFrame(tick);
  }
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    // motion
    p.vx *= p.drag;
    p.vy = (p.vy * p.drag) + p.gravity;
    p.x += p.vx;
    p.y += p.vy;

    // life
    p.life -= 1;
    p.a = Math.max(0, Math.min(1, p.life / 180));

    // twinkle
    p.tw += 0.18;
    const twinkle = 0.75 + 0.25 * Math.sin(p.tw);

    // draw glow
    ctx.save();
    ctx.globalAlpha = p.a * twinkle;

    ctx.shadowBlur = p.glow;
    ctx.shadowColor = `hsla(${p.hue}, 95%, 65%, ${p.a})`;
    ctx.fillStyle = `hsl(${p.hue}, 95%, ${60 + Math.random() * 10}%)`;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  });

  particles = particles.filter(p =>
    p.life > 0 &&
    p.x > -50 && p.x < canvas.width + 50 &&
    p.y > -50 && p.y < canvas.height + 50
  );

  if (particles.length) {
    requestAnimationFrame(tick);
  } else {
    animRunning = false;
  }
}

