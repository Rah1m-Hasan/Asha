# ASHA module layout and typography audit

## Scope

Reviewed the active application workspace (`index.html`, `app/main.js`, `app/style.css`), its generated FaceSpeak/FingerSpeak/VitalSense/SenseAssist/Posture content, the embedded FingerSpeak studio, and shared patient/caregiver pages using `asha-flow.css`.

## Findings and root causes

| Finding | Root cause | Correction |
| --- | --- | --- |
| Adjacent module cards could read as one surface | Card margins, module-specific gaps, and dynamically rendered sibling sections used different values | Introduced shared 8px-based spacing tokens and made module parents own a 24px section gap. |
| Bottom navigation could cover the final action or field | The fixed navigation had no formal reserved scroll/focus clearance | Added a bottom-nav clearance token to application views, scroll padding, and focus scroll margins. The navigation remains fixed and accessible. |
| Header cards felt too tall and visually dominant | Large padding, 22px radii, broad heading scale, and wide module-hero gaps compounded | Reduced active-app card/header padding and radii, tightened header typography, and retained safety text in the natural responsive flow. |
| Typography varied between DM Sans, Manrope, and arbitrary card rules | Root, heading, metric, and embedded-studio font declarations disagreed | Standardized the active application on Inter with Noto Sans Bengali/Hind Siliguri/system fallbacks. Bengali content remains readable if the external font is unavailable. |
| Shared camera content had uneven desktop proportions | The preview and supporting status areas did not share a deliberate card grid | Kept the original single camera node and handlers, but use a constrained two-column camera card at desktop and one-column stack below 900px. |
| Legacy FingerSpeak studio labels were too small | The embedded studio used 10–12px technical labels by default | Raised key training labels and descriptions while retaining all advanced controls and its original behaviour. |

## Layout corrections

- The active Details workspace now uses a parent grid gap for navigation, shared camera, module introduction, functional workspace, and FingerSpeak iframe.
- All active views are capped at 1440px and use responsive page gutters (`16px` mobile through `40px` desktop).
- Standard cards use 16px radii and 20–24px desktop / 16px mobile padding; metric and status surfaces use smaller 12px radii.
- VitalSense and Posture charts retain a controlled canvas height (160px desktop, 142px mobile) without making empty cards tall.
- Caregiver, patient, pairing, and module-directory pages share the same card padding, grid gaps, and content-width rhythm through `asha-flow.css`.

## Accessibility improvements

- Maintains native control focus, labels, and live status regions.
- Adds scroll clearance for keyboard focus so controls are not hidden beneath fixed navigation.
- Maintains non-color-only labels for status cards and warnings.
- Preserves existing reduced-motion handling and theme variables.

## Files changed

- `app/style.css` — typography tokens, layout rhythm, card patterns, camera proportions, and navigation-safe spacing.
- `asha-flow.css` — shared patient/caregiver/pairing card and responsive layout rhythm.
- `neuroface/fingerspeak.html` — typography fallback and readable studio label refinements.
- `docs/MODULE_LAYOUT_TYPOGRAPHY_AUDIT.md` — this report.

## Verification

- `npm test` and `git diff --check` are run after implementation.
- The repository’s browser test needs the optional Playwright package and browser binary, which are not installed in this environment. No browser screenshot or real camera/microphone claim is made here.
- Real-device follow-up should inspect 320px, 360px, 390px, 430px, 768px, 1024px, 1280px, 1440px, and 1920px in both themes, including virtual-keyboard and browser-zoom behaviour.
