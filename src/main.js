import { parseTimerParams, remaining, formatRemaining, nowEpoch, toSearchString } from "./timer.js";
import { renderQR } from "./qr.js";
import { buildShareURL, copyToClipboard } from "./share.js";
import "./style.css";

const setupView = document.getElementById("setup");
const timerView = document.getElementById("timer");
const countdown = document.getElementById("countdown");
const qrContainer = document.getElementById("qr-container");
const durationInput = document.getElementById("duration-input");
const decrementBtn = document.getElementById("decrement-btn");
const incrementBtn = document.getElementById("increment-btn");
const startBtn = document.getElementById("start-btn");
const copyBtn = document.getElementById("copy-link-btn");
const resetBtn = document.getElementById("reset-btn");

let tickFrameId = null;
let hasFinished = false;

function stepDuration(delta) {
  const val = Math.max(1, (parseInt(durationInput.value, 10) || 1) + delta);
  durationInput.value = val;
}

decrementBtn.addEventListener("click", () => stepDuration(-1));
incrementBtn.addEventListener("click", () => stepDuration(1));

durationInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") startBtn.click();
});

durationInput.select();

let audioCtx = null;

function ensureAudioContext() {
  if (audioCtx) {
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return;
  }
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  audioCtx = new AudioContextClass();
}

function playFinishSound() {
  if (!audioCtx) return;
  const duration = 0.3;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sine";
  osc.frequency.value = 880;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.15, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + duration);
}


/** Switch to counting-down view for the given timer params. */
function showTimer(start, duration) {
  hasFinished = false;
  countdown.classList.remove("timer-finished");
  ensureAudioContext();
  setupView.hidden = true;
  timerView.hidden = false;

  const shareURL = buildShareURL(start, duration);
  renderQR(qrContainer, shareURL);

  // Push timer params into the URL (without reload) so the link is shareable.
  history.replaceState(null, "", toSearchString(start, duration));

  const tick = () => {
    const left = remaining(start, duration, nowEpoch());
    countdown.textContent = formatRemaining(left);

    if (left <= 0) {
      if (!hasFinished) {
        hasFinished = true;
        countdown.classList.add("timer-finished");
        playFinishSound();
      }
      return;
    }

    tickFrameId = requestAnimationFrame(tick);
  };
  tick();

  copyBtn.onclick = async () => {
    const ok = await copyToClipboard(shareURL);
    copyBtn.textContent = ok ? "Copied!" : "Copy Link";
    if (ok) setTimeout(() => (copyBtn.textContent = "Copy Link"), 1500);
  };
}

/** Stop the countdown and return to setup view. */
function resetTimer() {
  if (!confirm("Are you sure you want to reset the timer? The current countdown is lost and you can set a new timer by clicking OK. You need to share a new link.")) return;
  if (tickFrameId !== null) {
    cancelAnimationFrame(tickFrameId);
    tickFrameId = null;
  }
  hasFinished = false;
  countdown.classList.remove("timer-finished");
  timerView.hidden = true;
  setupView.hidden = false;
  qrContainer.innerHTML = "";
  countdown.textContent = "--:--";
  copyBtn.textContent = "Copy Link";
  history.replaceState(null, "", location.pathname);
  durationInput.select();
}

// Handle starting a timer from the duration input.
function handleStartFromInput() {
  ensureAudioContext();
  const minutes = Number(durationInput.value);
  if (!minutes || minutes <= 0) return;
  const durationSeconds = minutes * 60;
  showTimer(nowEpoch(), durationSeconds);
}

startBtn.addEventListener("click", handleStartFromInput);

// On load: if URL has timer params, go straight to countdown.
const params = parseTimerParams(new URLSearchParams(location.search));
if (params) {
  showTimer(params.start, params.duration);
}

// Reset button returns to setup view.
resetBtn.onclick = resetTimer;
