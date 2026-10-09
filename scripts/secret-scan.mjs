import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
// An optional local credential file lets operators detect exact values without
// baking a workstation path or any secret into the repository.
const configPath = process.env.MAIRA_CONFIG_PATH;
const maira = configPath
  ? JSON.parse(await fs.readFile(configPath, "utf8"))
  : {};
const secrets = [maira.api_key, maira.project_key].filter(Boolean);
const staged = process.argv.includes("--staged");
const paths = execFileSync(
  "git",
  staged
    ? ["diff", "--cached", "--name-only", "--diff-filter=ACM"]
    : ["ls-files", "--cached", "--others", "--exclude-standard"],
  { encoding: "utf8" },
)
  .trim()
  .split(/\r?\n/);
const found = [];
for (const path of paths) {
  if (!/\.(js|mjs|json|html|css|md|yml|yaml|txt)$/.test(path)) continue;
  let text;
  try {
    text = await fs.readFile(path, "utf8");
  } catch {
    continue;
  }
  if (secrets.some((s) => text.includes(s))) found.push(path);
  if (/(?:vercel_blob_rw_|vcp_|sk-proj-)[A-Za-z0-9_=-]{20,}/.test(text))
    found.push(path);
}
console.log(
  JSON.stringify({
    filesChecked: paths.length,
    exactSecretsLoaded: secrets.length,
    secretFindings: [...new Set(found)],
  }),
);
if (found.length) process.exitCode = 1;
