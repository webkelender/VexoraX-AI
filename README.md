# VexoraX — Personal Assistant (PWA)

This folder is the whole app, ready to deploy to Vercel as-is. It's now an
installable Progressive Web App: a manifest, a service worker, and app icons
have been added, plus an "Install app" button that appears in supported
browsers.

## Deploy to Vercel

**Option A — CLI**
```
npm i -g vercel
cd vexorax-pwa
vercel
```
Accept the defaults. There's no build step — when Vercel asks for a
framework preset, pick **Other**; leave the build command empty and the
output directory as `.`.

**Option B — Dashboard**
Push this folder to a GitHub repo and import it in the Vercel dashboard, or
drag-and-drop the folder into vercel.com/new. Same settings as above (no
framework, no build command).

PWA install requires HTTPS — Vercel gives you that automatically, so nothing
extra to configure.

## Installing the app once it's live

- **Desktop Chrome/Edge**: an install icon appears in the address bar, or use
  the "Install app" button added to the header.
- **Android Chrome**: tap the "Install app" button, or the browser's own
  "Add to Home Screen" prompt.
- **iOS Safari**: Apple doesn't allow browsers to trigger an install prompt,
  so there's a small in-page hint instead — Share icon → "Add to Home
  Screen". Once installed it opens full-screen like a native app.

## Files added for PWA support

| File | Purpose |
|---|---|
| `manifest.webmanifest` | App name, icons, colors, display mode |
| `sw.js` | Service worker — caches the app shell for instant/offline loads; never caches AI API calls |
| `icons/` | App icons (regular + maskable + Apple touch icon) |
| `favicon.ico` | Browser tab icon |
| `vercel.json` | Makes sure the service worker/manifest are always revalidated, so updates roll out promptly |

## If you edit `index.html` later

Bump `CACHE_VERSION` in `sw.js` (e.g. `'vexorax-v1'` → `'vexorax-v2'`) when
you redeploy. Otherwise browsers that already installed the app may keep
serving the old cached version for a while.

## One thing worth knowing

The built-in Voice tab uses the browser's speech-recognition API, which only
actually works in real Google Chrome or Edge (Google restricts it elsewhere).
It'll show a clear message if it can't reach the recognition service rather
than failing silently.
