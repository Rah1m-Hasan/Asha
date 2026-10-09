# Architecture

## Runtime boundaries

```text
Patient/caregiver browser
  app/main.js ── request gate ── /api/session ── store adapter ── Supabase or Vercel Blob
       │              │                 │
       │              └─ explicit confirmation only
       ├─ SpeechCapture ─ browser Web Speech API
       ├─ Perception ─ shared camera ─ face/hand workers, local MediaPipe, optional YOLO worker
       └─ /api/asha ─ orchestrator ─ retrieval + Maira provider
                                  └─ validated optional proposal, then same request gate
```

## Main flows

1. Setup creates a patient ID and separate patient/caregiver tokens. The server stores hashes, not tokens. Each authenticated request reloads the profile and checks role and expiry.
2. Touch, hand, calibrated face, speech, and AI proposal inputs can call `propose()`. `RequestGate` opens the existing dialog; only `confirmRequest()` creates a delivered event.
3. FaceSpeak keeps natural blink observation separate from calibrated rapid-triple intent and a later deliberate confirmation blink. FingerSpeak receives hand frames from the parent shared stream through a same-origin iframe bridge.
4. SenseAssist owns a bounded Web Speech session. Asha speech pauses capture, then resumes after cooldown; generation checks ignore old callbacks.
5. Perception owns one camera stream and backpressured face/hand workers. It emits local observations for face, hands, posture, rest-like cues, and experimental pulse trends. YOLO is an optional secondary local pose worker.
6. The Asha API requires consent, validates provider output and citations, and returns only a reply plus optional non-executing proposal/module suggestion. The frontend applies proposals through the same confirmation gate.
7. Service worker caching is limited to static shell assets and model assets. Private API responses are not cached. Model fetches refresh from network when possible and use the last cached copy offline.

## Ownership notes

- `app/main.js`: DOM composition, view state, client credentials, request UI, chat, voice output/recording, and periodic polling.
- `app/perception.js`: camera and worker/model lifecycle; no caregiver delivery decisions.
- `app/speech-capture.js`: browser-recognition lifecycle only.
- `server/common.js` and `server/logic.js`: auth, sanitization, expiry, event policy.
- `server/asha-orchestrator.js`: prompt construction and untrusted-output validation.
- `server/store.js` / `server/supabase-store.js`: compatible persistence adapters.

Retained legacy routes/assets are not assumed unused merely because the current SPA does not import them directly; Vercel redirects and static deployment behavior were considered before cleanup.
