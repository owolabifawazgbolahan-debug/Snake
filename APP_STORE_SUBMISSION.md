# App Store Submission Guide

Submit Snake to **Apple App Store**, **Google Play Store**, and **Microsoft Store**.

## Prerequisites

### All Platforms
- [ ] Icon (512×512 PNG for iOS/Android, 1240×600 PNG for Windows)
- [ ] Screenshots (4–5 per store)
- [ ] App description (100–150 words)
- [ ] Privacy Policy URL (already in `PRIVACY.md`)
- [ ] Contact email

### iOS/Android
- Install Capacitor (web-to-native wrapper)

### Windows
- Use existing Electron build

---

## Step 1: Prepare Assets

### Icon (512×512 PNG)
Save as `assets/icon-512.png`:
```
A green snake emoji (🐍) on dark background
```

### Screenshots
- **iOS (3–5 screenshots, 1170×2532 or similar)**
  - Screenshot 1: Main game with snake
  - Screenshot 2: Menu with speed slider
  - Screenshot 3: Music toggle in action
  - Screenshot 4: Touch controls on mobile

- **Android (3–5 screenshots, 1080×1920)**
  - Same as iOS

- **Windows (1–3 screenshots)**
  - Main window

### Description (100–150 words)
```
Snake — Aviator is a fast-paced, smooth Snake game with stunning animations.

Features:
✨ Gorgeous rounded snake with directional eye and tongue animation
🎵 Toggle background music and sound effects
⚡ Adjustable difficulty: slow to super-fast gameplay
📱 Touch controls for mobile, keyboard controls for desktop
🏆 Persistent high-score tracking
🕹️ Offline play (after first install)

Play on iPhone, Android, Windows, or as a web app. Completely free, no ads, no tracking.
```

---

## Step 2: iOS (Apple App Store)

### 2.1 Enroll in Apple Developer Program
- Go to https://developer.apple.com/account
- Pay $99/year
- Enroll (takes ~5 min to 24 hours)

### 2.2 Build iOS App (Using Capacitor)

```bash
# Install Capacitor (one-time)
npm install --save @capacitor/core @capacitor/cli
npx cap init

# Follow prompts:
# - App name: Snake
# - App ID: com.aviator.snake
# - Web dir: . (current folder)

# Add iOS platform
npx cap add ios

# Build web assets
npm run build

# Copy to Capacitor
npx cap copy

# Open Xcode
npx cap open ios
```

In Xcode:
- Select `App` → `Signing & Capabilities`
- Sign with your Apple Developer account
- Set Bundle ID: `com.aviator.snake`
- Go to Product → Archive → Distribute App
- Upload to App Store Connect

### 2.3 Submit in App Store Connect
- Go to https://appstoreconnect.apple.com
- New App → iOS
- Fill in:
  - App Name: Snake
  - Bundle ID: com.aviator.snake
  - SKU: snake-aviator-2026
  - Primary Category: Games
  - Rating: (select age group — 4+)
- Upload screenshots & description
- Set price: Free
- Review & Submit
- **Wait 1–3 days for Apple approval**

---

## Step 3: Android (Google Play Store)

### 3.1 Enroll in Google Play Console
- Go to https://play.google.com/console
- Pay $25 (one-time)
- Complete account info

### 3.2 Build Android App (Capacitor)

```bash
# Add Android platform
npx cap add android

# Open Android Studio
npx cap open android
```

In Android Studio:
- Build → Generate Signed Bundle/APK → Choose AAB (App Bundle)
- Create/select keystore for signing
- Release build (not debug)
- Upload `.aab` file

### 3.3 Submit in Google Play Console
- Apps → Create new app → Snake
- App name: Snake
- Category: Games
- Fill in store listing:
  - Short description (50 chars): Fast-paced Snake with animations
  - Full description: (use description from Step 1)
  - Screenshots (5 required)
  - Icon, banner, feature graphic
- Content rating: IARC (questionnaire)
- Pricing: Free
- Upload AAB file
- Review & Submit
- **Wait 2–24 hours for Google review**

---

## Step 4: Microsoft Store (Windows)

### 4.1 Enroll in Partner Center
- Go to https://partner.microsoft.com/dashboard
- Create business account
- Pay ~$19 (one-time, may vary by region)

### 4.2 Build Windows App

```bash
# Your existing Electron build works!
npm run build
```

Creates:
- `dist/Snake Setup 1.0.0.exe` — installer
- `dist/Snake 1.0.0.exe` — portable

### 4.3 Create MSIX Package (optional, required for Store)

```bash
# Install electron-builder
npm install --save-dev electron-builder

# Already configured in package.json
npm run build
```

### 4.4 Submit in Partner Center
- Apps & games → Create app → Snake
- Basic info:
  - Publisher display name: (your name)
  - App name: Snake
  - Category: Games
- Screenshots & descriptions
- Pricing: Free
- Submit
- **Wait ~1 week for Microsoft review**

---

## Step 5: Track Status

| Store | Review Time | Status Link |
|-------|-------------|-------------|
| **iOS** | 1–3 days | App Store Connect → My Apps → Snake |
| **Android** | 2–24 hrs | Google Play Console → Snake → Release management |
| **Windows** | ~1 week | Partner Center → Apps → Snake |

---

## Troubleshooting

### iOS Build Fails
- Ensure Xcode is updated: `sudo softwareupdate -i -a`
- Check provisioning profiles in Xcode
- Clear build cache: `rm -rf ios/Pods && npx cap copy`

### Android Build Fails
- Ensure Android SDK is installed
- Check `android/local.properties` has correct SDK path
- Rebuild: `npx cap copy && npx cap open android`

### Windows Store Rejection
- Ensure app runs without admin privileges
- Test offline mode works
- Check privacy policy is public URL

---

## After Approval

- **iOS**: App appears in App Store within hours
- **Android**: App appears in Google Play within hours
- **Windows**: App appears in Microsoft Store within hours

Update apps via:
- Bump version in `package.json` → rebuild → resubmit
- iOS/Android: New build via Capacitor → Archive/AAB
- Windows: New build via Electron Builder

---

## Optional: Auto-Updates (In-App)

For iOS/Android, add Capacitor's App plugin to check for updates:
```bash
npm install @capacitor/app
```

Then add auto-update check in `game.js`:
```javascript
import { App } from '@capacitor/app';

App.addListener('appStateChange', ({ isActive }) => {
  if (isActive) {
    // Check for app updates
    console.log('App resumed, update available?');
  }
});
```

---

## Summary Checklist

- [ ] Enroll Apple Developer Program ($99)
- [ ] Enroll Google Play Console ($25)
- [ ] Enroll Microsoft Partner Center (~$19)
- [ ] Create 512×512 icon
- [ ] Take & optimize screenshots
- [ ] Write app description
- [ ] Build iOS app with Capacitor
- [ ] Build Android AAB with Capacitor
- [ ] Verify Windows Electron build
- [ ] Submit all three apps
- [ ] Wait for approvals (1–7 days)
- [ ] Launch & celebrate! 🎉

---

**Total Cost**: ~$143 (all three platforms, one-time + annual iOS renewal)
**Total Time**: ~2–3 hours setup + 1 week waiting for approvals
