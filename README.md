# ASHA · Assistive communication workspace

ASHA is a browser-based assistive communication demonstration. It brings together a caregiver-supported setup flow, patient communication controls, local camera-based interaction experiments, speech assistance, and optional cloud guidance.

> **Safety notice:** ASHA is a research/demo application, not a medical device, emergency service, or validated monitoring system. Do not use camera, gesture, pulse, posture, or speech observations as a diagnosis or as the only way to request urgent help.

## Production deployment

The current production application is deployed at:

- **https://asha-unified-app.vercel.app/**

Supported production entry points:

- Patient entry: `https://asha-unified-app.vercel.app/patient`
- Caregiver entry: `https://asha-unified-app.vercel.app/caregiver`
- FaceSpeak: `https://asha-unified-app.vercel.app/?module=facespeak`
- FingerSpeak: `https://asha-unified-app.vercel.app/?module=fingerspeak`
- VitalSense: `https://asha-unified-app.vercel.app/?module=vitalsense`
- SenseAssist: `https://asha-unified-app.vercel.app/?module=senseassist`
- Posture: `https://asha-unified-app.vercel.app/?module=posture`
- Health check: `https://asha-unified-app.vercel.app/api/health`

Use the exact links above. Legacy standalone routes such as `/vitalsense/`, `/neuroface/`, `/modules/`, and `/pair/` are excluded from the Vercel output; some non-trailing legacy paths intentionally redirect to the unified SPA.

## What the application does

- Guides a patient/caregiver setup and creates separate private patient and caregiver access links.
- Keeps caregiver requests behind an explicit patient confirmation step; requests can be received and acknowledged by a caregiver.
- Supports touch controls, calibrated FaceSpeak gestures, FingerSpeak gesture training, browser speech recognition, and typed communication assistance.
- Runs face, hand, pose, and camera pulse-trend experiments locally in the browser when permission is granted.
- Uses one shared camera stream for supported sensing modules, with worker and compatible fallback paths.
- Offers optional, consent-gated cloud assistance through the server API. AI responses can suggest wording or a non-executing action, but cannot bypass the confirmation flow.
- Includes dark/light themes, PWA assets, keyboard focus styles, reduced-motion support, and responsive layouts.

## Architecture

```text
Browser SPA (index.html + app/)
  ├─ Request and navigation UI          app/main.js
  ├─ Shared camera / sensing pipeline   app/perception.js + workers
  ├─ Speech capture                     app/speech-capture.js
  └─ API requests                       /api/session and /api/asha

Vercel serverless API (api/ + server/)
  ├─ Private patient/caregiver sessions
  ├─ Vercel Blob or Supabase persistence
  ├─ Confirmed caregiver events
  └─ Consent-gated AI orchestration and retrieval
```

The main application is vanilla JavaScript, HTML, and CSS; it does not use a React, TypeScript, or bundler build step. The repository also retains browser-module assets and legacy sources needed by the unified experience.

## Local development

Requirements: Node.js 22+ and npm.

```sh
npm install
npm test
npm start
```

The local preview runs at `http://127.0.0.1:4180`.

`npm start` is a static development server. Its API proxy is configured in [`scripts/dev.mjs`](scripts/dev.mjs); production behavior should be validated on the Vercel deployment as well.

## Testing

```sh
# Unit and contract tests
npm test

# Optional browser workflow test; requires Playwright and a compatible browser
npm run test:browser
```

The test suite covers request gating, calibration and gesture logic, sensing helpers, storage adapters, AI orchestration validation, service-worker behavior, and responsive layout contracts. Browser workflows additionally require camera/browser support and are environment-dependent.

## Deploying to Vercel

This directory is linked to the Vercel project named `asha-unified-app`.

1. Run the test suite and review the working tree.
2. Commit and push the intended revision to the GitHub repository.
3. If the Git integration is connected, Vercel deploys the push automatically.
4. To deploy manually from an authenticated Vercel CLI session:

   ```sh
   npx vercel --prod
   ```

5. Verify the deployment URL and `GET /api/health` after the deployment becomes ready.

`vercel.json` defines API duration, redirects, rewrites, security headers, and the expiry-cleanup cron. `.vercelignore` intentionally keeps legacy standalone pages, tests, local tooling, Flutter output, and large unused artifacts out of the production deployment.

## Environment configuration

Production secrets belong in Vercel Environment Variables, never in the client or Git history.

| Variable | Purpose |
| --- | --- |
| `MAIRA_API_KEY`, `MAIRA_PROJECT_KEY` | Enables consent-gated cloud assistance. |
| `SUPABASE_URL`, `SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY` | Enables Supabase-backed private storage. |
| `BLOB_READ_WRITE_TOKEN` | Enables the Vercel Blob storage fallback. |
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` | Enables optional web-push notifications. |
| `CRON_SECRET` | Protects scheduled cleanup when configured. |

Run [`supabase/schema.sql`](supabase/schema.sql) before enabling Supabase storage. After setting environment variables, redeploy and check `/api/health`; then validate a full patient-to-caregiver request and acknowledgement flow.

## Security and privacy boundaries

- Patient and caregiver links use separate role tokens; server storage retains token hashes rather than raw tokens.
- Caregiver events are persisted only after explicit confirmation.
- Camera processing is local to the browser. Browser permissions, lighting, device performance, and background-tab behavior affect availability.
- Cloud assistance requires consent before reviewed text is sent to the server.
- API responses use `no-store`; secrets must remain server-side.

## Audit summary — 2026-10-11

The repository and live deployment were reviewed before this README update.

- The unified SPA, API routes, server modules, browser sensing pipeline, service worker, Vercel configuration, responsive styles, and test suite were inspected.
- Production root, health endpoint, service worker, responsive stylesheet, and embedded FingerSpeak asset returned HTTP 200 at `https://asha-unified-app.vercel.app`.
- The deployed stylesheet contains the current responsive containment changes for small phones, tablets, and short landscape viewports.
- The `.vercelignore` rules explain the production 404 responses for excluded legacy standalone files; the supported URLs are listed in the production section above.
- Existing automated tests pass with `npm test`. A real-device/browser pass remains required for camera, microphone, virtual-keyboard, push-notification, screen-reader, and two-device caregiver workflows.

Known engineering risks and manual-validation items are tracked in [`docs/audit/REMAINING_RISKS.md`](docs/audit/REMAINING_RISKS.md). The system's medical and emergency-use limitations are intentional product constraints, not guarantees that can be removed by a deployment.

## Repository map

| Path | Responsibility |
| --- | --- |
| `app/` | Unified frontend, responsive UI, camera pipeline, module interactions. |
| `api/` | Vercel serverless API handlers. |
| `server/` | Authentication, storage, retrieval, provider, and orchestration logic. |
| `neuroface/` | FaceSpeak/FingerSpeak assets, models, and browser modules. |
| `models/` | Local pose and YOLO model assets and licensing information. |
| `okf/` | Versioned knowledge bundle used for retrieval context. |
| `tests/` | Node tests, browser workflow scripts, and responsive layout contracts. |
| `docs/audit/` | Detailed architecture, audit findings, and remaining risks. |

See [`models/README.md`](models/README.md) and the included model licenses before redistributing the model assets, especially the YOLO asset with AGPL-3.0 terms.
