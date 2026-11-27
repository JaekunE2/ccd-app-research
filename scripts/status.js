'use strict';
// Which harness the hub uses, where projects go, and how many there are.
const fs = require('fs');
const path = require('path');

const harness = path.resolve(process.env.HARNESS_DIR || path.join(__dirname, '..', 'harness'));
console.log(`harness folder: ${harness} ${fs.existsSync(path.join(harness, 'lib', 'project.js')) ? '(ok)' : '(missing: run Reinstall)'}`);
try {
  const P = require(path.join(harness, 'lib', 'project.js'));
  const cfg = P.config();
  const v = P.templateVars();
  console.log(`projects folder: ${cfg.projects_root}`);
  console.log(`projects: ${P.listProjects().length}`);
  console.log(`hub CLI: ${v.CCD}`);
  console.log(`skills: ${v.SKILLS}`);
} catch (e) { console.log(`config: ${e.message}`); }
if (process.env.HUB_DIR) {
  let hubCfg = {};
  try { hubCfg = JSON.parse(fs.readFileSync(path.join(process.env.HUB_DIR, 'config.json'), 'utf8')); } catch {}
  if (process.env.CCD_HARNESS || hubCfg.researchHarness) {
    console.log(`NOTE: the hub is pinned to ${process.env.CCD_HARNESS || hubCfg.researchHarness} (env CCD_HARNESS or config.json "researchHarness"); remove that to use this app's harness.`);
  } else console.log('hub: uses this harness after a restart (plugin "research-harness" provides it)');
}
