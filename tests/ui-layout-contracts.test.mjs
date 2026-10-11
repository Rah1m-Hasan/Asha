import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("responsive UI contracts protect long text, dialogs, and embedded modules", async () => {
  const css = await read("app/style.css");

  assert.match(css, /height: min\(680px, 78dvh\)/);
  assert.match(css, /max-height: calc\(100dvh - 32px\)/);
  assert.match(css, /\.event \.secondary \{\s*width: 100%/);
  assert.match(css, /\.card,[\s\S]*?overflow-wrap: anywhere/);
  assert.doesNotMatch(css, /\.view\.landing-page[^}]*overflow:\s*clip/);
});

test("navigation and accessible controls retain their direct, keyboard-safe behavior", async () => {
  const [main, senseAssist] = await Promise.all([
    read("app/main.js"),
    read("senseassist/app.js"),
  ]);

  assert.match(main, /menuToggle\?\.addEventListener\("click", \(\) => show\("settings"\)\)/);
  assert.match(main, /if \(event\.key === "Escape"\)[\s\S]*?closeChat\(\)/);
  assert.match(senseAssist, /querySelector\('\[role="tablist"\]'\)\.addEventListener\('keydown'/);
  assert.match(senseAssist, /event\.key === 'ArrowRight'/);
});

test("the shared camera remains between module navigation and module content", async () => {
  const [html, main] = await Promise.all([
    read("index.html"),
    read("app/main.js"),
  ]);
  const tabs = html.indexOf('id="moduleTabs"'),
    camera = html.indexOf('class="camera-panel card"'),
    content = html.indexOf('id="moduleContent"'),
    fingerStudio = html.indexOf('id="fingerStudioHost"');

  assert.ok(tabs >= 0 && tabs < camera && camera < content && content < fingerStudio);
  const renderModule = main.slice(main.indexOf("function renderModule()"));
  assert.doesNotMatch(renderModule, /captureDock\.append\(viewport\)/);
});

test("application content reserves space for fixed navigation and uses the shared type scale", async () => {
  const css = await read("app/style.css");

  assert.match(css, /--bottom-nav-clearance: calc\(104px \+ env\(safe-area-inset-bottom\)\)/);
  assert.match(css, /scroll-padding-bottom: var\(--bottom-nav-clearance\)/);
  assert.match(css, /padding: var\(--space-6\) var\(--page-gutter\) var\(--bottom-nav-clearance\)/);
  assert.match(css, /font:\s*16px Inter,/);
});

test("responsive guardrails keep dense modules and auxiliary panels in the viewport", async () => {
  const [appCss, flowCss, neuroCss, vitalSense, fingerSpeak, overlay, nav] =
    await Promise.all([
      read("app/style.css"),
      read("asha-flow.css"),
      read("neuroface/style.css"),
      read("vitalsense/index.html"),
      read("neuroface/fingerspeak.html"),
      read("asha-overlay.js"),
      read("asha-nav.js"),
    ]);

  assert.match(appCss, /max-height: calc\(100dvh - var\(--bottom-nav-clearance\) - 96px\)/);
  assert.match(appCss, /@media \(max-height: 560px\) and \(orientation: landscape\)/);
  assert.match(flowCss, /\.topbar nav\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(neuroCss, /@media\(max-width:480px\)/);
  assert.match(vitalSense, /@media \(max-width:600px\)/);
  assert.match(fingerSpeak, /class="page-disclaimer"/);
  assert.match(overlay, /max-height:calc\(100dvh - 104px\)/);
  assert.match(nav, /@media\(max-width:360px\)\{#asha-pages-menu\{grid-template-columns:1fr/);
});
