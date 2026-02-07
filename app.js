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

// ================= Helpers =================
function resetNoButtonPosition() {
  noBtn.style.position = "";
  noBtn.style.left = "";
  noBtn.style.top = "";
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
  const padding = 6;

  const minX = padding;
  const minY = padding;
  const maxX = Math.max(minX, zoneRect.width - btnRect.width - padding);
  const maxY = Math.max(minY, zoneRect.height - btnRect.height - padding);

  const x = Math.random() * (maxX - minX) + minX;
  const y = Math.random() * (maxY - minY) + minY;

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
  moveNoButton();

  if (dodgeLevel === maxDodge) {
    noBtn.classList.remove("blocked");
  }
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
  yayTitle.textContent = "😏";
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

function popConfetti() {
  const pieces = 180;

  confetti = Array.from({ length: pieces }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.2,
    r: 4 + Math.random() * 5,
    vx: -2 + Math.random() * 4,
    vy: 2 + Math.random() * 4,
    rot: Math.random() * Math.PI,
    vr: -0.15 + Math.random() * 0.3,
    life: 120 + Math.random() * 60
  }));

  requestAnimationFrame(tick);
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.03;
    p.rot += p.vr;
    p.life -= 1;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 180));

    const hue = SUNSET_HUES[Math.floor(Math.random() * SUNSET_HUES.length)];
    const lightness = 60 + Math.random() * 15;

    ctx.fillStyle = `hsl(${hue}, 95%, ${lightness}%)`;
    ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r);

    ctx.restore();
  });

  confetti = confetti.filter(
    (p) => p.life > 0 && p.y < canvas.height + 40
  );

  if (confetti.length) requestAnimationFrame(tick);
}
