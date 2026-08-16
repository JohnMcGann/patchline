# OLMC Patch Line — Android app (Expo / React Native)

A native React Native (Expo) port of the OLMC Patch Line PWA. Same data, same
"wait-and-send" dialling. Android now; iOS can be added later from the same code.

## Prerequisites
- Node.js installed
- EAS CLI: `npm install -g eas-cli` (you already have this)
- A free Expo account (`eas login`)

## First build — installable APK (for testing on your own Android)
```bash
cd patchline-native
npm install
eas login
eas build -p android --profile preview
```
- On the first run EAS will offer to create the project and generate a signing
  keystore — say **yes** (EAS stores the keystore securely for you).
- When it finishes it gives a URL to **download the .apk**. Open that on your
  Android phone and install it (you may need to allow "install from this source").

## Later — Play Store bundle (.aab)
```bash
eas build -p android --profile production
```
Upload the resulting `.aab` in the Google Play Console. (Requires a $25 Play
developer account; new personal accounts must run a 14-day/12-tester closed test
before public release.)

## iOS later (same codebase)
```bash
eas build -p ios --profile preview
```
Requires an Apple Developer account ($99/yr). No code changes needed.

## Project layout
- `App.tsx` — all UI (tabs, search, zone/district chip filters, dial modal, share modal)
- `src/data.ts` — hospital/service data, zones, districts, dial-string builder
- `app.json` — app name, package `ca.responsecore.patchline`, icons, splash
- `eas.json` — build profiles: `preview` (APK), `production` (AAB)
- `assets/` — icon, adaptive icon, splash, QR image

## Notes
- Dialling uses the same `tel:` mechanism as the web app; the wait character `;`
  lets your phone queue the menu digits for you to send on cue. No app (native or
  otherwise) can auto-send DTMF into a call without being the default dialer.
- To change hospital/district data, edit `src/data.ts` only.
