# Blue healthcare theme migration

## Original architecture and audit

The application has several independently authored UI surfaces rather than one global
theme: the main dashboard (`app/style.css`), companion/care flows (`asha-flow.css`),
SenseAssist, NeuroFace/FaceSpeak, FingerSpeak, VitalSense, and the shared floating
assistant/navigation scripts. Light and dark preferences are already persisted by the
existing JavaScript through `data-theme` and/or `body.light`; those selectors and the
toggle behaviour were preserved.

The initial color inventory found brand green/teal in root variables, button and active
tab fills, hero decoration, SVG branding, PWA metadata, canvas signal accents, and
script-injected chat/navigation UI. Semantic green remains in connection/success and
good-quality states; amber remains warning/uncertain; red remains error/poor quality.

`app/blue-theme.css` is the shared, late-loaded semantic refinement layer for the
standalone modules. This lets their existing theme selectors and presentation logic stay
intact while establishing one blue identity without changing module behaviour.

## Palette

| Token | Light | Dark |
| --- | --- | --- |
| Primary | `#2563EB` | `#60A5FA` |
| Primary hover / interactive | `#1D4ED8` | `#93C5FD` |
| Heading | `#15345B` | `#BFDBFE` |
| Background | `#F8FAFC` | `#0B1424` |
| Surface | `#FFFFFF` | `#17263D` |
| Subtle surface | `#EFF6FF` | `#111E32` |
| Main text | `#172B4D` | `#F1F5F9` |
| Muted text | `#64748B` | `#A8B8CC` |
| Border | `#DBE5F0` | `#293B54` |

## Updated tokens and surfaces

- Main application tokens (`--bg`, `--card`, `--soft`, `--ink`, `--muted`, `--line`,
  `--accent`) now map to the healthcare palette in both modes.
- Shared module refinements expose semantic `--color-*` names and map existing local
  variables to the same palette.
- CTA buttons, active tabs, active navigation, overlays, assistant messages, decorative
  effects, charts, canvas landmarks, focus rings, browser theme color, and the SVG app
  mark use blue brand values.
- Green connection/success, amber warning, and red danger colors were deliberately kept
  distinct. They are not used as general brand accents.

## Files modified for this migration

- Styling: `app/style.css`, `app/blue-theme.css`, `asha-flow.css`,
  `neuroface/style.css`, `senseassist/styles.css`.
- Presentation scripts: `app/main.js`, `app/perception.js`, `neuroface/app.js`,
  `asha-overlay.js`, `asha-nav.js`.
- Visual/PWA assets: `app/icon.svg`, `app.webmanifest`, `sw.js`.
- Templates and page metadata: `index.html`, `patient/index.html`,
  `caregiver/index.html`, `pair/index.html`, `senseassist/index.html`,
  `neuroface/index.html`, `neuroface/fingerspeak.html`, `vitalsense/index.html`.

The service-worker cache name was incremented only so the new shared stylesheet and SVG
are not held behind an older visual cache. No API, data, ML, camera, speech, gesture, or
workflow code was changed.

## Verification

### Static and route checks

- Theme/color search reviewed CSS, HTML, JavaScript, SVG, manifests, and inline styles.
- Remaining green references are semantic success/quality indicators; brand green and
  teal primary-action references were migrated.
- Local preview returned HTTP 200 for `/`, `/caregiver/`, `/patient/`, `/pair/`,
  `/modules/`, `/neuroface/`, `/neuroface/fingerspeak.html`, `/senseassist/`,
  `/vitalsense/`, and `/asha.html`.
- Light/dark selector persistence was preserved; no toggle or storage logic was changed.

### Accessibility

Primary light CTA (`#2563EB` on white), light heading (`#15345B` on white), dark main
text (`#F1F5F9` on `#0B1424`), and muted dark text (`#A8B8CC` on `#0B1424`) meet or
exceed normal-text AA contrast. Focus outlines use the primary/accent blue with a 3px
offset. Status meanings retain separate success/warning/danger colors rather than using
blue alone.

### Tests

`npm test`: **pass** — 19 test files, 19 passing, 0 failing.

`npm run test:browser`: **not runnable in this environment**. Its test harness requests
a Windows-specific Playwright path that is not installed here. Screenshot comparison,
camera/microphone permissions, and interactive viewport checks at 360, 390, 768, 1024,
1440, and 1920 pixels therefore require a browser-enabled CI or local environment.

## Remaining limitations

- Existing raster PNG icons and the Asha portrait were not recolored: they were not safe
  brand-only vector accents and the character/meaningful image colors were preserved.
- The shared compatibility layer remains in place for independently maintained module
  layouts, while their direct primary-brand declarations were also migrated.
- No automated visual screenshot diff was available in this container.

## Engineering summary

| Item | Result |
| --- | --- |
| Light mode completed | Yes |
| Dark mode completed | Yes |
| Brand colors migrated | Yes |
| Responsive layouts verified | Static layout rules preserved; browser viewport pass limited |
| Functional regression tests | Pass (19/19) |
| Visual regression tests | Not run (Playwright unavailable) |

Theme migration changed 22 files including this document: 5 CSS files, 1 SVG asset,
6 presentation/cache JavaScript files, 1 manifest, and 8 templates. There were no
intentional non-visual changes; existing unrelated working-tree modifications were
preserved.
