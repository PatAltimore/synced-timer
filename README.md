# Synced Timer

Browser-based countdown timer with QR-code sharing. Open the app, set a duration, and share the synced countdown to any device via QR code or link.

## How It Works

All timer state lives in the URL:

```
https://example.com/?s=1741718400&d=300
```

| Param | Meaning |
|-------|---------|
| `s`   | Start time — Unix epoch seconds (UTC) |
| `d`   | Duration — seconds |

A device scanning the QR code (or opening the link) reads these params and counts down from the same absolute start time. No server, no websockets — clocks stay in sync because both devices reference the same UTC epoch.

## Quick Start

```bash
npm install
npm run dev
```

Open the local URL, pick a duration, hit **Start & Share**, and scan the QR code from another device on the same network.

## Build

```bash
npm run build    # outputs to dist/
npm run preview  # preview production build locally
```

## Stack

- **Vite** — dev server and build tool
- **Vanilla JS** — no framework
- **qrcode** — QR code generation (npm)

## Project Structure

```
index.html          Entry point
src/
  main.js           App orchestration — reads URL, wires UI
  timer.js          Timer math — pure functions (parse, remaining, format)
  qr.js             QR code rendering wrapper
  share.js          URL building and clipboard copy
  style.css         Styles
```
