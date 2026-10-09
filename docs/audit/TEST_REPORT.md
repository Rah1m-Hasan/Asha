# Test report

## Baseline

- Commit audited: `7755828`.
- Initial worktree: clean.
- Initial unit suite: 18/18 test files passed (`npm test`).
- Dependency advisory lookup: not completed because registry DNS/network access was unavailable.
- `npm ls --all` reported dependencies absent from this sandbox. The dependency-free unit tests still ran; this is not evidence that a fresh install is healthy.

## Final automated results

- `npm test`: 19/19 test files passed; 0 failures, skips, cancellations, or TODOs.
- Added `tests/service-worker.test.mjs`: model-cache cleanup, online refresh, and offline fallback.
- Expanded `tests/signals.test.mjs`: fail-closed expiry and universal confirmation invariant.
- `node --check` passed for maintained JS/MJS sources, API/server modules, scripts, tests, and `sw.js`.
- `node okf/compile.mjs` regenerated no changes to `okf/generated.js`.
- `git diff --check` passed.

## Not executed / limitations

- Browser scripts were not run: they contain Windows-specific Playwright and Chrome paths and depend on a deployed backend. No browser, webcam, microphone, service-worker install, push subscription, real MediaPipe, ONNX, or physical-device result is claimed.
- Live API tests were not run because they create/delete remote care circles and require configured production services.
- `npm audit` could not reach the npm advisory endpoint.
- The exact-value secret scan could not complete in this sandbox because child-process execution of `git` is blocked by the sandbox despite returning its file list. The scan was made path-portable; run it in CI/workstation with `MAIRA_CONFIG_PATH` when exact secret matching is desired.
- No coverage percentage is configured by the repository.
