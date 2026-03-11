---
name: "project-conventions"
description: "Core conventions and patterns for the synced-timer codebase"
domain: "project-conventions"
confidence: "high"
source: "keaton"
---

## Context

Synced countdown timer — vanilla JS, Vite build, no framework. All timer state lives in URL query params.

## Patterns

### URL-Driven State

Timer state is encoded as `?s=<epoch_seconds>&d=<duration_seconds>`. No backend, no persistence. The URL is the single source of truth.

### Module Responsibilities

- `src/timer.js` — Pure functions only. No DOM, no side effects. All timer math lives here.
- `src/qr.js` — QR rendering. Takes a container element and a URL string.
- `src/share.js` — URL building and clipboard. Depends on timer.js for param formatting.
- `src/main.js` — Orchestration. Reads URL, wires DOM events, calls other modules.

### Code Style

- ES modules (`import`/`export`), no CommonJS.
- camelCase for variables and functions.
- No TypeScript (yet) — keep the build chain minimal.

### File Structure

- `index.html` — Entry point (Vite serves from root)
- `src/` — All application source code
- `dist/` — Build output (gitignored)

### Testing

- TBD — Hockney will set up. Timer math in `src/timer.js` is pure and testable.

## Anti-Patterns

- **Don't put state in a backend** — The URL carries everything. No rooms, no databases, no websockets unless we explicitly decide to add them.
- **Don't add a framework** — Vanilla JS is intentional. No React, Vue, or Svelte.
- **Don't use milliseconds in URLs** — Epoch seconds for readability. Convert internally if needed.
