# NeuroBridge ASHA module UI/UX redesign

## Scope and inventory

The redesign covers the active shared-camera Details workspace in `index.html` and `app/main.js`, plus the full embedded FingerSpeak studio. It does not change perception, model inference, calibration values, camera ownership, speech capture, AI routing, data storage, or request confirmation.

| Module | Existing functional inventory retained | Presentation change |
| --- | --- | --- |
| FaceSpeak / NeuroFace Sense | Shared camera and overlays; neutral reference; guided calibration; blink, head, lip, smile, AU, motion and gaze observations; gesture rules; JSON activity export | A readiness-first workspace with a calibration path, gesture reference, compact live status, and a clearly labelled diagnostics disclosure. |
| FingerSpeak | Embedded MediaPipe camera studio; vocabulary CRUD; one/two-hand and temporal training; guided recording; DTW/model evaluation; speech mode; logs; quick familiar-pose mapping | A clear module introduction and optional quick-mapping card precede the untouched full training studio. |
| VitalSense | Shared-camera forehead sampling; estimated pulse trend; collection window; quality/reason states; existing chart | An observation card pairs actual signal information with capture guidance and a persistent non-clinical limitation. |
| SenseAssist | Language selection; optional practice context; 90-second start/stop listening; editable transcript; text-to-speech practice; AI clarification; alternatives; patient-confirmed caregiver proposal | Listening and transcript review are now separate, ordered panels with visible status, review language, and a restrained suggestion area. |
| Posture | Shared pose landmarks; current posture, tilt, and movement; trend chart; optional YOLO cross-check; rest-to-awake check-in logic | Current observation, limitation language, and optional cross-check controls are separated into readable cards. |

## Original UI issues addressed

- The modules were mostly single dense cards, which gave calibration, live status, and safety information equal visual weight.
- FaceSpeak exposed many useful diagnostics before explaining readiness and calibration.
- SenseAssist mixed microphone control, transcript review, and AI output into one uninterrupted form.
- VitalSense and Posture placed limitations after dense metric content rather than alongside it.
- The module chooser did not expose a clear active state or module-specific visual cue.

## Shared design-system improvements

- Uses existing healthcare-blue theme tokens in light and dark mode.
- Adds consistent module headers, live/status badges, safety notes, instruction cards, 8px-derived spacing, and 12–22px radii.
- Improves module navigation with labelled icons, visible selected state, and `role="tab"` / `aria-selected` state updates.
- Uses responsive one-column breakpoints for narrow screens; forms and action rows stack at 560px.
- Keeps the shared camera primary in the Details layout and does not create a second camera stream.

## Accessibility improvements

- Preserves original control IDs, labels, live-region statuses, keyboard-accessible buttons, and dialogs.
- Adds explicit live-status roles to current capture and recognition messages.
- Keeps status text alongside badges; status is never communicated by color alone.
- Uses focusable native `details` for FaceSpeak diagnostics and retains all controls in the normal tab sequence.
- Honors the existing reduced-motion rules and avoids hover-only controls.

## Files changed

- `index.html` — semantic module tab navigation.
- `app/main.js` — presentation-only module templates and selected-tab state.
- `app/face-studio.js` — FaceSpeak layout hierarchy, retaining all observation IDs and handlers.
- `app/style.css` — shared workspace, status, navigation, responsive, and accessibility presentation rules.

## Verification and limitations

- Passed: `npm test` (20 suites).
- Passed: `git diff --check`.
- Attempted: `npm run test:browser`. The optional Playwright package/browser binary is not installed in this environment, so browser screenshots and automated viewport inspection could not run.
- Browser-level checks still needed: 360px, 390px, 768px, 1024px, 1440px, and 1920px in both themes. Camera and microphone availability, permission-denied states, and real inference output require browser/device verification because they depend on real browser permissions and supported hardware.
- No screenshots are committed by this change. Existing browser test screenshots, when browser dependencies are available, remain the before/after visual reference location under `artifacts/`.
