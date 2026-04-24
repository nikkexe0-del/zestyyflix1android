# Zestyyflix Android App

All OTTs. One App. No BS.

## 🚀 How to get your APK (zero setup)

1. Push this repo to GitHub (make it **public** or keep it private — both work)
2. Go to **Actions** tab in your GitHub repo
3. Click **"Build Signed APK"** → **"Run workflow"**
4. Wait ~5 minutes for the build to finish
5. Download the APK from:
   - The **Releases** section (auto-created), OR
   - **Actions → your run → Artifacts → zestyyflix-apk**

That's it. No secrets to configure. No keystore to manage. Everything is self-contained.

## 🔑 Signing Details (already embedded in the repo)

The keystore is committed at `android/app/zestyyflix.keystore`.

| Field | Value |
|-------|-------|
| Keystore file | `android/app/zestyyflix.keystore` |
| Store password | `zestyyflix2024secure` |
| Key alias | `zestyyflix` |
| Key password | `zestyyflix2024secure` |
| Validity | 10,000 days (~27 years) |
| Algorithm | RSA 2048-bit |

> These are hardcoded in `android/app/build.gradle` under `signingConfigs.release`.

## 🛠 Local development

```bash
npm install
npm run dev           # Web dev server
npm run build         # Build React app
npx cap sync android  # Sync to Android project
npx cap open android  # Open in Android Studio
```

## 📦 Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Capacitor v6 (WebView wrapper)
- TMDB API (movie metadata)
- vidlink.pro (stream embeds)

## App ID
`com.nikkkexe.zestyyflix`
