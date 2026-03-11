# Project Context

- **Owner:** Pat Altimore
- **Project:** synced-timer
- **Stack:** Vite + Vanilla JS, mobile-first web app for synchronized countdowns
- **Created:** 2026-03-11

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-03-11: Minute-based UI and Reset Feature
- Updated input to use **minutes** instead of seconds for better UX (converts to seconds internally for URL encoding).
- Countdown display already had MM:SS formatting via `formatRemaining()` in timer.js.
- Added **Reset button** that:
  - Cancels the animation frame to stop the countdown loop
  - Clears QR code and resets UI state
  - Returns to setup view
  - Clears URL params
- Reset button styled with red (#dc2626) to distinguish from primary action.
- Default duration changed from 60s to 5 minutes for more realistic use case.
### 2026-03-11: Timer finish flash and sound
- When the countdown reaches 0, the display clamps to 00:00, briefly flashes via a timer-finished animation, and plays a short, single beep.
- If a URL loads where the timer is already past zero, we immediately show the finished state and trigger the same one-shot finish behavior (subject to browser audio policies).

### 2026-03-11: Countdown font sizing
- Enlarged the primary MM:SS countdown using `font-size: clamp(3rem, 18vw, 5.5rem)` so it reads clearly on phones while staying within the 400px layout.
- Slightly tightened spacing around the timer to keep the QR block and controls comfortably in view on common mobile heights.
