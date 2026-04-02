# NeuroCalm - Release Checklist

## 1. Project Verification
- [x] Build works correctly (`npm run build`)
- [x] TypeScript errors fixed (`npm run lint`)
- [x] Capacitor configured (`capacitor.config.ts`)
- [x] Android platform added (`npx cap add android`)
- [x] Assets synced (`npx cap sync android`)

## 2. Android Configuration
- [x] App name: NeuroCalm
- [x] Package name: com.neurocalm.app
- [x] Version code: 1
- [x] Version name: 1.0.0

## 3. App Icon and Splash
- [ ] Proper app icon exists (512x512) in `assets/icon.png`
- [ ] Splash screen exists (2732x2732) in `assets/splash.png`
- [ ] Generate Android adaptive icons (`npx @capacitor/assets generate --android`)

## 4. Permissions
- [x] Minimal permissions (Internet only) in `AndroidManifest.xml`

## 5. Performance Check
- [x] No `console.log` found in codebase
- [x] Timers are self-contained and cleaned up (verified in refactor)
- [x] Bundle size optimized (standard Vite build)

## 6. Paywall & Voice System
- [x] Premium logic works (verified in `HomeScreen.tsx`)
- [x] Trial system works (verified in `AppContext.tsx`)
- [x] Voice system does not loop (verified in `useVoice.ts` and step components)
- [x] Voice toggle works (verified in `ProtocolEngine.tsx`)

## 7. Build Output
- [ ] Generate AAB file (`cd android && ./gradlew bundleRelease`)
- [ ] Sign the AAB file with your release keystore
- [ ] Verify release build works on a physical device

## 8. Store Assets
- [x] App description (short + long) generated in `store_assets.md`
- [x] Feature bullets generated in `store_assets.md`
- [x] Suggested screenshots list generated in `store_assets.md`
- [x] Privacy policy text generated in `store_assets.md`

## 9. Final Store Submission
- [ ] Create a new app in Google Play Console
- [ ] Upload the signed AAB file
- [ ] Fill in store listing details
- [ ] Complete content rating and data safety questionnaires
- [ ] Submit for review
