# Run Snake as a Desktop App (Electron)

## Quick Start

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org (LTS version recommended)

2. **Install dependencies**
   ```bash
   cd "All My codes\Aviator"
   npm install
   ```

3. **Run the app**
   ```bash
   npm start
   ```

The Snake game will launch in a standalone window.

## Build Installer (Windows)

To create a `.exe` installer:

```bash
npm run build
```

Output files appear in the `dist/` folder:
- `Snake Setup 1.0.0.exe` — Full installer
- `Snake 1.0.0.exe` — Portable (no install needed)

## Troubleshooting

- **"npm not found"**: Reinstall Node.js, restart terminal.
- **"module not found"**: Run `npm install` again in the project folder.
- **App won't start**: Check the terminal for errors; uncomment `mainWindow.webContents.openDevTools();` in `main.js` to debug.

## Files Included

- `main.js` — Electron entry point
- `package.json` — Dependencies and build config
- `preload.js` — Security bridge (minimal, game-ready)

## Platform Notes

- **Windows**: `npm run build` creates `.exe`
- **macOS**: Creates `.dmg` and `.zip`
- **Linux**: Creates `.AppImage` and `.deb`
