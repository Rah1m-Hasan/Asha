# Refactor changelog

## 2026-10-09

### Enforce confirmation at the delivery boundary

- Problem: server validation exempted three event kinds from patient confirmation.
- Root cause: an API exception outlived the UI's proposal-and-confirm workflow.
- Changed: `server/logic.js`, `api/session.js`, `tests/signals.test.mjs`.
- Solution: centralized `hasPatientConfirmation()` and require it for every caregiver event.
- Compatibility: requests that the UI already sends remain unchanged; direct unconfirmed observation delivery is intentionally rejected to preserve the documented safety model.
- Verification: unit safety-invariant coverage and complete test suite.

### Fail closed on invalid session expiry

- Problem: corrupt/missing expiry data could authorize a profile forever and escape cleanup.
- Root cause: comparing `NaN < Date.now()` returns false.
- Changed: `server/logic.js`, `server/common.js`, `api/cleanup.js`, `tests/signals.test.mjs`.
- Solution: one `expired()` helper treats invalid, absent, and current-time expiry as expired.
- Compatibility: valid ISO expiry timestamps retain their existing seven-day behavior.
- Verification: unit cases for invalid, missing, elapsed, and future values.

### Make model caching deployment-safe

- Problem: model assets were cache-first indefinitely and obsolete caches remained.
- Root cause: cache key did not account for deployment compatibility and activation did not prune old model caches.
- Changed: `sw.js`, `tests/service-worker.test.mjs`.
- Solution: network-first cached model retrieval, offline fallback, and versioned model-cache cleanup.
- Compatibility: model requests and offline fallback are preserved; online loads may refresh an asset after deployment.
- Verification: simulated service-worker activation, fresh fetch, and offline fallback test.

### Harden optional worker and recording lifecycles

- Problem: YOLO initialization cancellation/error paths and recording timers could retain stale resources.
- Changed: `app/perception.js`, `app/main.js`.
- Solution: worker-local initialization ownership with cancellation/termination and state reset; recorder-local timeout/stream cleanup on failure, navigation, and page exit.
- Compatibility: same buttons, labels, recording limit, model, and shared camera behavior.
- Verification: syntax validation and complete unit suite. Real camera/microphone verification remains required.

### Make operator scripts portable

- Problem: audit scripts depended on `D:/mairaapi.json`.
- Changed: `scripts/secret-scan.mjs`, `scripts/provider-check.mjs`, `README.md`.
- Solution: opt-in `MAIRA_CONFIG_PATH`; absent configuration permits generic secret-pattern scan without loading credentials.
- Compatibility: operators explicitly provide the same local file; runtime secrets and deployment configuration are unchanged.
