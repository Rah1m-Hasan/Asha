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
