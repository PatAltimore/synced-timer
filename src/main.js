import { parseTimerParams, remaining, formatRemaining, nowEpoch, toSearchString } from "./timer.js";
import { renderQR } from "./qr.js";
import { buildShareURL, copyToClipboard } from "./share.js";
import "./style.css";

const setupView = document.getElementById("setup");
const timerView = document.getElementById("timer");
const countdown = document.getElementById("countdown");
const qrContainer = document.getElementById("qr-container");
const durationInput = document.getElementById("duration-input");
const startBtn = document.getElementById("start-btn");
const copyBtn = document.getElementById("copy-link-btn");

/** Switch to counting-down view for the given timer params. */
function showTimer(start, duration) {
  setupView.hidden = true;
  timerView.hidden = false;

  const shareURL = buildShareURL(start, duration);
  renderQR(qrContainer, shareURL);

  // Push timer params into the URL (without reload) so the link is shareable.
  history.replaceState(null, "", toSearchString(start, duration));

  const tick = () => {
    const left = remaining(start, duration, nowEpoch());
    countdown.textContent = formatRemaining(left);
    if (left > 0) requestAnimationFrame(tick);
  };
  tick();

  copyBtn.onclick = async () => {
    const ok = await copyToClipboard(shareURL);
    copyBtn.textContent = ok ? "Copied!" : "Copy Link";
    if (ok) setTimeout(() => (copyBtn.textContent = "Copy Link"), 1500);
  };
}

// On load: if URL has timer params, go straight to countdown.
const params = parseTimerParams(new URLSearchParams(location.search));
if (params) {
  showTimer(params.start, params.duration);
} else {
  // Setup view — user picks duration, hits start.
  startBtn.onclick = () => {
    const d = Number(durationInput.value);
    if (!d || d <= 0) return;
    showTimer(nowEpoch(), d);
  };
}
