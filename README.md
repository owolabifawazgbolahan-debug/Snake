# Snake (Aviator)

Open [index.html](index.html) in your browser to play.

**Install as an app:** See [APP.md](APP.md) to install on desktop/mobile.

**Desktop standalone (Electron):** See [ELECTRON.md](ELECTRON.md) for `.exe` installer and native app.

**CI/CD & GitHub:** Push to `main` branch; GitHub Actions auto-builds Windows/Mac/Linux installers. Tag releases (`v1.0.0`) for GitHub Releases.

**Submit to App Stores:** See [APP_STORE_SUBMISSION.md](APP_STORE_SUBMISSION.md) for iOS, Android, and Windows Store. Follow [CAPACITOR_SETUP.md](CAPACITOR_SETUP.md) for native builds.

Controls:
- Arrow keys or WASD to move
- Space to pause/resume
- Use Start/Restart buttons

Additional features:
- Smooth, rounded snake rendering with directional eye and tongue animation
- Background music toggle (click "Music") and eat/game tones
- Speed slider and dynamic difficulty
- Mobile touch controls (on-screen arrows)
- High-score persistence (saved to localStorage)
- Packaging script: `package.bat` to create Aviator.zip

Testing:
- See [TESTING.md](TESTING.md) for a quick checklist

Files added:
- [index.html](index.html)
- [style.css](style.css)
- [game.js](game.js)
 - [package.bat](package.bat)
 - [TESTING.md](TESTING.md)
