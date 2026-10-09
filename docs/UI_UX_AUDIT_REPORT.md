# UI/UX Audit Report — NeuroBridge ASHA

Date: 2026-10-09

## Scope and screen inventory

The audit covered the primary ASHA SPA (`index.html` and `app/main.js`), its shared styles, and the standalone patient, caregiver, pairing, module, FingerSpeak, SenseAssist, NeuroFace, and VitalSense entry points.

| Reachable interface | Entry path / state | Principal UI pieces inspected |
|---|---|---|
| Landing page | `/` | Header, theme control, hamburger-to-Settings route, hero, cards, footer |
| Care-circle setup | Landing “Set Up With a Caregiver” | Support profile, assessment, recommendation, consent, private-link handoff |
| Patient dashboard | Patient link, saved session, or live demo | Quick requests, monitoring controls, request history, confirmation gate |
| Caregiver dashboard | Caregiver link, navigation, or demo | Patient list, status cards, requests, acknowledgement controls |
| FaceSpeak | Details → FaceSpeak | Camera panel, calibration, signal/status cards |
| FingerSpeak | Details → FingerSpeak | Dynamic embedded calibration studio and quick mappings |
| VitalSense | Details → VitalSense; `/vitalsense/` | Metrics, chart, signal-quality state, warnings |
| SenseAssist | Details → SenseAssist; `/senseassist/` | Transcript editor, consent, proposed wording, tabs |
| Posture | Details → Posture | Shared camera, status, optional YOLO control |
| Asha chat | Floating Asha button | Message history, input, close and keyboard behavior |
| Settings | Header hamburger or Settings route | Theme, speech, privacy, voice controls |
| Transient states | Request, calibration and private-link dialogs; toast; empty/error/loading states | Dialog sizing, status copy, focus behavior |
| Standalone care flow | `/caregiver/`, `/pair/`, `/patient/`, `/modules/` | Responsive cards/forms, theme controls, embedded monitor |

## Confirmed findings and fixes

Total confirmed defects: 9. Fixed: 9. Remaining confirmed defects: 0.

### High

| Issue | Screen | Severity | Root cause | Fix | Verification |
|---|---|---|---|---|---|
| FingerSpeak reserved a 2200px iframe before its own content-size message arrived. | Details → FingerSpeak | High | Fixed placeholder height created a large empty region and poor small-screen/zoom behavior. | Replaced it with a viewport-aware loading height; the existing postMessage resize still owns the final height. | Source-contract regression test; JavaScript syntax and unit suite pass. |

### Medium

| Issue | Screen | Severity | Root cause | Fix | Verification |
|---|---|---|---|---|---|
| The landing page clipped horizontal overflow at the page boundary. | Landing | Medium | `overflow: clip` could conceal, rather than solve, an overflowing child. | Removed the clipping and constrained the preview/connection-note content using intrinsic sizing and wrapping. | Regression test asserts no landing-page clipping rule; static responsive review at 320px/zoom-equivalent constraints. |
| Long generated requests and custom text could force card/flex children wider than their containers. | Patient, caregiver, chat, camera/status cards | Medium | Grid/flex descendants lacked consistent `min-width: 0` and robust wrap behavior. | Added scoped `min-width: 0` and `overflow-wrap: anywhere` rules at those component boundaries; narrow event actions stack safely. | Regression test plus stylesheet review. |
| Dialog footers could fall below short/zoomed viewports. | Request confirmation, calibration, private-link dialog | Medium | Dialogs had no viewport-relative maximum height or internal scroll. | Added `max-height: calc(100dvh - 32px)` and dialog-local scrolling. | Regression test and CSS static check. |
| The patient-link input imposed a 240px minimum width. | Standalone patient missing-link state | Medium | Inline fixed minimum could exceed a narrow/zoomed card. | Replaced it with a flexible zero minimum and retained wrapping actions. | Source review and responsive stylesheet contract. |
| Embedded VitalSense sizing was rigid on compact devices. | Standalone patient monitor | Medium | Mobile override used a fixed 620px height. | Made the mobile monitor height viewport-aware while retaining its useful working area. | Source review. |

### Low

| Issue | Screen | Severity | Root cause | Fix | Verification |
|---|---|---|---|---|---|
| Theme controls did not expose their current pressed state or destination. | Main and standalone headers | Low | Visual glyphs were the only state cue. | Theme helpers now update `aria-pressed`, accessible label, and main-control title. | Unit suite and source-contract test. |
| The floating chat did not restore focus on close or support Escape. | Asha chat | Low | Chat open/close only toggled `hidden`. | Added dialog semantics, labelled heading, Escape handling, and opener-focus restoration. | Source-contract test and syntax check. |
| SenseAssist tabs were click-only and both remained in the tab sequence. | Standalone SenseAssist | Low | Incomplete ARIA tab implementation. | Implemented roving tabindex and Arrow/Home/End navigation. | Source-contract test and syntax check. |
| Browser test script was tied to Windows-specific executable paths. | Visual-regression runner | Low | Hard-coded Playwright and Chrome locations. | Uses the local optional Playwright package/default browser lookup and reports missing prerequisites clearly. | `npm run test:browser` now fails with the actionable prerequisite message rather than a machine-specific path error. |

## Theme, responsive, and accessibility results

- Light/dark tokens and logo variants were traced through landing, standalone care-flow, module, and embedded-module styles. The healthcare blue identity and semantic warning/success colors were preserved.
- Added Bangla-capable system font fallbacks in both shared style systems; no text was shortened to solve wrapping.
- Responsive source checks covered the requested small-phone through desktop breakpoint ranges, zoom-sensitive dialog/input sizing, one-column event actions, and page-width constraints. Rendered viewport screenshots could not be captured in this environment (see limitations).
- Existing focus styles, reduced-motion rules, native dialog behavior, visible labels, and touch-target sizing were retained. The audit added state labels, keyboard tabs, chat Escape/focus restoration, dialog labels, and robust text wrapping.

## Runtime and visual verification

- Browser console/network inspection: not run. The available browser suite could not start because Playwright and a browser binary are absent from this Linux workspace.
- Visual screenshots / comparisons: not created for the same reason. No screenshot baseline was fabricated.
- Hardware-dependent paths (camera, microphone, Web Speech, face/hand tracking) were not invoked; no patient data or live session was accessed.
- The browser runner remains reusable once Playwright is installed and `npm run start` is serving the app. It exercises landing/setup, patient/caregiver acknowledgement, FingerSpeak, SenseAssist, theme switching, camera state, posture, console errors, and mobile overflow.

## Automated checks

| Check | Result |
|---|---|
| Baseline `npm test` before changes | 19 passing test files |
| Final `npm test` | 20 passing test files, 0 failures |
| JavaScript syntax checks | Passed for modified application and test modules |
| `git diff --check` | Passed |
| Local route smoke test | Passed: `/`, patient, caregiver, pair, modules, SenseAssist, NeuroFace, FingerSpeak, and VitalSense each returned HTTP 200 |
| `npm run test:browser` | Blocked only by missing optional Playwright/browser prerequisites; runner portability fixed |
| Prettier check | Reports style deviations in existing compact source files. No broad formatting rewrite was applied because it would create unrelated repository-wide diffs. |

## Files changed

- `app/style.css`
- `app/main.js`
- `index.html`
- `asha-flow.css`
- `asha-flow.js`
- `patient/index.html`
- `senseassist/app.js`
- `tests/browser.mjs`
- `tests/ui-layout-contracts.test.mjs`
- `docs/UI_UX_AUDIT_REPORT.md`

## Remaining risks / manual follow-up

There are no unresolved confirmed defects from the source and automated checks. The outstanding risk is rendered verification only: run the portable browser suite with Playwright available, then inspect light/dark screenshots at 320×568, 375×812, 430×932, 768×1024, 1024×768, 1440×900, and 1920×1080, including 80–200% zoom and mocked camera/microphone states. Review screenshots rather than auto-accepting them.
