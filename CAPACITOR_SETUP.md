# Capacitor Setup for iOS & Android

Capacitor wraps your web game as a native iOS/Android app. This is the easiest way to submit to Apple & Google app stores.

## Prerequisites

- **Node.js** (already installed)
- **Xcode** (macOS) — for iOS builds
- **Android Studio** (macOS/Windows/Linux) — for Android builds

### Install Xcode (macOS only)
```bash
xcode-select --install
```

### Install Android Studio
1. Download from https://developer.android.com/studio
2. Install Android SDK (latest version)
3. Set `ANDROID_HOME` environment variable

---

## Quick Start

### 1. Install Capacitor

```bash
npm install --save @capacitor/core @capacitor/cli
```

### 2. Initialize Capacitor

```bash
npx capacitor init
```

When prompted:
```
App name: Snake
App Package ID: com.aviator.snake
Web assets directory: . (current folder)
```

This creates `capacitor.config.json` (already in your folder).

### 3. Add iOS Platform (macOS only)

```bash
npx capacitor add ios
```

Creates `ios/` folder with Xcode project.

### 4. Add Android Platform (all OS)

```bash
npx capacitor add android
```

Creates `android/` folder with Android Studio project.

### 5. Copy Web Assets

```bash
npx capacitor copy
```

Copies `index.html`, `game.js`, `style.css` into native apps.

---

## Build for iOS

### Step 1: Open in Xcode

```bash
npx capacitor open ios
```

### Step 2: Configure Signing

1. Select `App` (left sidebar)
2. Click `Signing & Capabilities`
3. Team: Select your Apple Developer team
4. Bundle ID: `com.aviator.snake` (should be auto-filled)

### Step 3: Build & Archive

1. Product → Archive (top menu)
2. Distribute App → App Store Connect
3. Upload to App Store Connect
4. Go to https://appstoreconnect.apple.com to complete submission

---

## Build for Android

### Step 1: Open in Android Studio

```bash
npx capacitor open android
```

### Step 2: Create Keystore (signing key)

1. Build → Generate Signed Bundle/APK
2. Module: `app`
3. Click "Create new..." for keystore
4. Fill in:
   - Key store path: `~/android-release.jks`
   - Password: (strong password, save it!)
   - Key alias: `release`
   - Key password: (same or different)
   - Validity: 25 years
5. Click OK

### Step 3: Build Release AAB

1. Build Type: `Release`
2. Signature versions: V1 & V2
3. Finish → Build
4. AAB file appears in `android/app/release/app-release.aab`

### Step 4: Upload to Google Play

1. Go to https://play.google.com/console
2. Apps → Snake → Releases → Production
3. Upload `app-release.aab`
4. Fill in store listing
5. Submit for review

---

## Build for Windows (Electron)

Already set up! Just run:

```bash
npm run build
```

Creates `.exe` files in `dist/` folder.

---

## Troubleshooting

### "Capacitor not found"
```bash
npm install --save @capacitor/core @capacitor/cli
```

### iOS: "Xcode not found"
```bash
xcode-select --install
```

### iOS: "Team not found"
In Xcode → Signing & Capabilities, manually select your Apple Developer account.

### Android: "Android SDK not found"
Set `ANDROID_HOME`:
- macOS: `echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc`
- Windows: `setx ANDROID_HOME "C:\Users\YOUR_USER\AppData\Local\Android\sdk"`

### App won't load
1. Run `npx capacitor copy` to update web files
2. Rebuild in Xcode/Android Studio
3. Check browser console for JS errors

---

## Common Commands

```bash
# Copy updated files to native apps
npx capacitor copy

# Sync iOS/Android with latest config
npx capacitor sync

# Open iOS in Xcode
npx capacitor open ios

# Open Android in Android Studio
npx capacitor open android

# Update Capacitor
npm update @capacitor/core @capacitor/cli
```

---

## After App Approval

When iOS/Android apps are approved and live:

1. Update version in `capacitor.config.json`:
   ```json
   "version": "1.0.1"
   ```

2. Copy new web files:
   ```bash
   npx capacitor copy
   ```

3. Rebuild:
   ```bash
   # iOS: Archive in Xcode
   # Android: Generate new AAB in Android Studio
   ```

4. Resubmit to app stores (same process)

---

## Next Steps

1. Follow [APP_STORE_SUBMISSION.md](APP_STORE_SUBMISSION.md) for detailed store instructions
2. Enroll in Apple Developer Program & Google Play Console
3. Use this guide to build and submit your app
