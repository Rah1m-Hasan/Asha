# NeuroBridge ASHA audit report

Audit date: 2026-10-09. Scope: the unified vanilla-JavaScript SPA, Vercel API and server modules, browser ML/workers, PWA, OKF/RAG, configuration, tests, retained legacy assets, and operator scripts. Generated/vendor runtime bundles and model binaries were inventoried but not rewritten.

## Overall assessment

The active application has clear safety boundaries in its patient request gate, blink intent state machine, server-side token roles, structured AI-response validation, and local-first camera processing. The most recent SenseAssist changes are well isolated in `app/speech-capture.js`; its generation guard, bounded 90-second session, pause/resume logic, and existing regression tests specifically address stale recognition callbacks and Asha-output echo.

The principal maintenance concern is concentration of orchestration/UI state in `app/main.js` (about 2,400 lines). It remains compatible, but makes full browser-level regression coverage important for future changes.

## Confirmed findings and status

| Severity | Finding | Affected area | Status |
| --- | --- | --- | --- |
| High | The API allowed unconfirmed `test`, `posture`, and `face_change` events to be delivered, even though observations must be proposed and explicitly confirmed first. | `api/session.js` | Fixed: all persisted caregiver events require `confirmed === true`. |
| High | Missing or malformed `expiresAt` values authenticated indefinitely because `Date.parse(...) < now` is false for `NaN`. Cleanup also retained them. | `server/common.js`, `api/cleanup.js` | Fixed: expiry is fail-closed and cleanup removes malformed profiles. |
| Medium | Cache-first model requests and no cache cleanup could retain models incompatible with newly deployed application code. | `sw.js` | Fixed: model requests are network-first with offline fallback; obsolete model caches are removed on activation. |
| Medium | Optional YOLO initialization could leave a failed/stopped worker reference and later present stale state. | `app/perception.js` | Fixed: initialization is cancellable, failed workers are terminated and cleared, and stop clears YOLO state. |
| Medium | A previous voice-recording timeout could stop a later recording; acquired streams were not consistently released on setup failure or navigation. | `app/main.js` | Fixed: recorder-local ownership, timeout cleanup, and view/page cleanup. |
| Low | Secret audit/provider-check scripts embedded a workstation-specific credential path. | `scripts/secret-scan.mjs`, `scripts/provider-check.mjs` | Fixed: explicit `MAIRA_CONFIG_PATH` is required only when credentials are needed. |
| Low | Unsupported methods reached authentication in the session endpoint rather than consistently returning 405. | `api/session.js` | Fixed. |

## Verified controls

- Patient and caregiver role hashes are compared with timing-safe equality; roles are checked per API action.
- Caregiver requests are gated in the UI and now again at the persistence boundary.
- Natural blink counting is independent of the deliberate calibrated blink-intent state machine.
- AI text is parsed as untrusted structured data; tool proposals are limited, intent-checked, and still open the patient confirmation dialog.
- Camera image/landmark inference is browser-local by static inspection. AI requests contain typed/transcribed text and permitted context, subject to client consent.
- Blob and Supabase stores keep a common read/write/list/remove adapter surface; Supabase tests cover the private service-key request format.

## Potential risks not changed

- Receipt updates are read-modify-write. Two caregivers acting concurrently can still race and overwrite an acknowledgement; solving this safely requires a storage-level compare-and-set/RPC design and deployment/schema review.
- Event idempotency has a read-before-create window. A concurrent duplicate may return a transient storage error before a retry returns the stored event. The fixed UUID makes retry safe, but not fully atomic in both adapters.
- `app/yolo-worker.js` loads ONNX Runtime WASM from jsDelivr while the model itself is local. This is a supply-chain/offline availability dependency; local runtime artifacts should be provisioned and integrity-reviewed before removing the CDN fallback.
- No restrictive CSP is configured. Adding one requires a browser/device validation pass because workers, model assets, speech, and optional CDN runtime must be accounted for.
- The browser tests are tied to Windows Playwright/Chrome paths and a deployed API proxy, so they were not runnable in this Linux sandbox.

## Code-quality and performance observations

- `app/main.js` owns navigation, rendering, request delivery, speech, chat, and recording state. It is the primary future refactoring candidate, but no broad split was made because that risks user-flow regressions.
- Camera processing uses bounded single-frame worker queues and a shared media stream. No unbounded inference queue was found.
- Pulse history is bounded to roughly 22 seconds; facial logs and training data have explicit caps in their respective modules.
- No proven-dead production files were removed. Legacy Flutter/static assets may be referenced by retained hosting/history paths, so they remain untouched.

## Accessibility assessment

The active UI uses labeled controls, live/status text, native dialogs, keyboard button handlers, reduced-motion CSS, and responsive layouts. Static inspection found no change required that could be made without a browser/screen-reader pass. Focus trapping, real screen-reader announcements, touch target measurements, and mobile layout remain manual verification items.
