# NeuroBridge ASHA icon-system audit

## Outcome

The active ASHA app now uses a local, Lucide-style outline SVG system for its
interactive navigation and module controls. `app/icons.js` is deliberately
small and dependency-free, so the build-free frontend remains usable without a
CDN or an icon-font download. Icons use rounded caps and joins with a 2px
stroke; they inherit semantic colour from their context.

## Audit inventory and changes

| Area | Classification | Previous treatment | Updated treatment | Size |
| --- | --- | --- | --- | --- |
| Theme and Settings entry | Navigation | Moon/sun and hamburger Unicode glyphs | Outline moon/sun and menu SVGs; Settings action and behaviour unchanged | 20px, 44px target |
| Module tabs | Feature/module navigation | Mixed `◉`, `☝`, `⌁`, `◌`, and `↔` glyphs | Scan face, hand, activity, microphone, accessibility | 22px |
| Shared camera | Primary/secondary action | Text-only camera and calibration controls | Camera/camera-off and sliders icons paired with labels | 20px |
| FaceSpeak | Module feature/action | Text-only calibration actions | Scan-face heading, sliders calibration, rotate-reference | 20–28px |
| FingerSpeak | Module feature/action | Text-only gesture training | Hand heading and training icon | 20–28px |
| VitalSense | Status/module feature | Abstract glyph and text-only warning | Activity heading and information icon beside the non-diagnostic notice | 18–28px |
| SenseAssist | Primary/secondary action | Text-only microphone, stop, playback, and clarify actions | Mic, square stop, volume, and language icons paired with labels | 20–28px |
| Posture | Module feature/action | Generic text action | Accessibility heading and scan cross-check control | 20–28px |
| Bottom navigation | Navigation | `⌂`, `▥`, and `♡` glyphs | House, layout-list, and heart-handshake | 20px |
| Asha chat | Assistant/action | `×`, `↑`, and text Send controls | Close and send SVGs; launcher avatar retained | 20–21px, 44px target |
| Reusable overlay and standalone headers | Assistant/navigation | Symbol-based close/send/theme controls | Same local outline close, send, moon, and sun treatment | 20–21px |

Static branding images, PWA icons, charts, clinical status dots, and logos were
not replaced: they are not interface icons and their existing purpose is
distinct. Status information continues to include text rather than relying on
colour or a pictogram alone.

## Tokens and appearance

`app/style.css` defines `--icon-xs` (16px), `--icon-sm` (18px), `--icon-md`
(20px), `--icon-nav` (22px), and `--icon-module` (28px). Light-mode icons use
the ASHA blue, slate, navy, and soft-blue palette; dark mode uses the matching
light-blue, muted-blue, near-white, and deep-blue tokens. Button and icon-only
controls retain at least a 44px interactive target. Small navigation icons are
standalone rather than placed in decorative square containers.

## Accessibility

- SVGs paired with labels are `aria-hidden` to avoid duplicated announcements.
- Icon-only controls retain explicit accessible names (theme, Settings,
  close, send, and assistant launcher).
- Existing labels on camera, speech, calibration, and training controls remain
  visible.
- Existing keyboard event handlers, focus styling, tab behaviour, disabled
  states, and `aria-selected` state are untouched.

## Functional preservation

Only presentation markup, CSS, and accessible labels changed. Element IDs,
data attributes, event bindings, form submission behaviour, module routing,
camera control flow, AI/speech integrations, and data operations are
unchanged. Dynamic camera and YOLO labels continue to change as before while
their icon treatment is preserved.

## Verification

- Syntax checked: `app/icons.js`, `app/main.js`, `app/face-studio.js`,
  `asha-overlay.js`, and `asha-flow.js`.
- Diff whitespace check: `git diff --check`.
- Automated repository tests: see the final implementation handoff for the
  current `npm test` result.

Browser screenshot verification is limited to environments where the local
development server and browser runner are available. The CSS uses wrapping
module tabs and preserves 20px icons on narrow screens (320–430px); at desktop
widths it retains the existing responsive grids through 1920px.

## Modified files

- `app/icons.js`
- `app/main.js`
- `app/face-studio.js`
- `app/style.css`
- `index.html`
- `asha-overlay.js`
- `asha-flow.js`
- `asha-flow.css`
