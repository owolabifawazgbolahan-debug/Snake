# Install Snake as an App

Your Snake game is now a Progressive Web App (PWA) — installable on desktop and mobile.

## Desktop (Chrome, Edge, Brave)

1. Open `index.html` in your browser
2. Look for the **install icon** in the address bar (↓ or +)
3. Click and select "Install"
4. The app will appear in your Start Menu / Applications

Shortcut: Use **Ctrl+Shift+S** (Chrome) or menu → "Install app"

## Mobile (iOS/Android)

### Android (Chrome, Brave)
1. Open `index.html` in your mobile browser
2. Tap the **menu** (⋮) → "Install app"
3. Confirm — app is added to home screen
4. Can play offline

### iOS (Safari)
1. Open `index.html` in Safari
2. Tap **Share** (↗️ icon)
3. Scroll and tap "Add to Home Screen"
4. Confirm — app is added to home screen

## Offline Play

Once installed, you can play offline thanks to the service worker cache. Your high score is saved in localStorage.

## Running Locally

Serve the folder via HTTP (some browsers require this):

```bash
# Python 3
python -m http.server 8000

# Node.js (if installed)
npx http-server

# macOS
cd /path/to/Aviator && open -a "Google Chrome" http://localhost:8000
```

Then visit `http://localhost:8000` and install from there.

## Files Added

- `manifest.json` — App metadata and icon
- `service-worker.js` — Offline caching and PWA support
- Updated `index.html` with manifest link and SW registration

## Troubleshooting

- **"Install not available"**: Use a Chromium browser (Chrome, Edge, Brave) and serve over HTTP/HTTPS.
- **"Not working offline"**: Wait for service worker to install (may take a few seconds).
- **iOS app won't update**: Delete from home screen and re-add.

## Optional: Electron (Desktop-Only)

For a native desktop app without a web server:

1. Install Node.js
2. `npm install -g electron`
3. Create `main.js` with Electron boilerplate to load `index.html`
4. Run: `electron main.js`

(Let me know if you want me to set this up.)
