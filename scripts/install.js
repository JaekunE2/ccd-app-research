'use strict';
// Install / uninstall the research harness from the app's settings (environment set by the hub):
//   HARNESS_DIR, RESEARCH_ROOT, SKILLS_DIR, LOCAL_ENV_FILE, MAX_PARALLEL_WORKERS, USAGE_SOFT_LIMIT, USAGE_HARD_LIMIT,
//   HUB_DIR (the hub folder: its ccd.js is what the director uses).
const fs = require('fs');
const path = require('path');

const APP = path.resolve(__dirname, '..');
const SRC = path.join(APP, 'harness');
const MARK = '.installed-by-hub-app';
const env = process.env;
const die = (m) => { console.error(`[harness] ${m}`); process.exit(1); };
const inside = (child, parent) => { const r = path.relative(parent, child); return r === '' || (!r.startsWith('..') && !path.isAbsolute(r)); };

const harness = path.resolve(env.HARNESS_DIR || SRC);
const external = path.resolve(harness) !== path.resolve(SRC);

if (process.argv.includes('--uninstall')) {
  if (external && fs.existsSync(path.join(harness, MARK))) {
    fs.rmSync(harness, { recursive: true, force: true });
    console.log(`[harness] removed ${harness}`);
  } else console.log('[harness] nothing outside the app folder to remove');
  if (env.RESEARCH_ROOT) console.log(`[harness] research projects stay in ${env.RESEARCH_ROOT}`);
  process.exit(0);
}

if (!env.RESEARCH_ROOT) die('set the research projects folder (RESEARCH_ROOT) in the app settings');
const root = path.resolve(env.RESEARCH_ROOT);
if (inside(root, harness) || inside(root, APP)) die('the research projects folder must be outside the harness and app folders');

// copy the harness files (an external folder must be empty or one we installed)
if (external) {
  if (fs.existsSync(harness) && fs.readdirSync(harness).length && !fs.existsSync(path.join(harness, MARK))) {
    die(`${harness} is not empty and was not installed by this app; choose another folder`);
  }
  fs.mkdirSync(harness, { recursive: true });
  for (const d of ['hooks', 'lib', 'tools', 'template']) fs.cpSync(path.join(SRC, d), path.join(harness, d), { recursive: true });
  for (const f of ['GATES.md', 'local-env.example.md']) fs.copyFileSync(path.join(SRC, f), path.join(harness, f));
  fs.writeFileSync(path.join(harness, MARK), 'research-harness\n');
}

// machine rules: the user's file, else keep an existing local-env.md, else the generic example
const localEnv = path.join(harness, 'local-env.md');
if (env.LOCAL_ENV_FILE) {
  if (!fs.existsSync(env.LOCAL_ENV_FILE)) die(`machine rules file not found: ${env.LOCAL_ENV_FILE}`);
  fs.copyFileSync(env.LOCAL_ENV_FILE, localEnv);
} else if (!fs.existsSync(localEnv)) fs.copyFileSync(path.join(SRC, 'local-env.example.md'), localEnv);

const num = (v, d) => (Number.isFinite(Number(v)) && String(v).trim() !== '' ? Number(v) : d);
const cfgFile = path.join(harness, 'config.json');
let prev = {};
try { prev = JSON.parse(fs.readFileSync(cfgFile, 'utf8')); } catch {}
const ccd = env.HUB_DIR && fs.existsSync(path.join(env.HUB_DIR, 'ccd.js')) ? path.join(env.HUB_DIR, 'ccd.js') : prev.ccd || '';
const cfg = {
  _comment: 'Autopilot limits live here, outside the project, so the agent cannot relax them. Directors must not edit this file. Written by the app settings (reinstall to change).',
  projects_root: root,
  ccd,
  ...(env.SKILLS_DIR ? { skills_dir: env.SKILLS_DIR } : {}),
  autopilot: { max_turns_per_hour: 40, no_progress_limit: 3, throttle_wait_min: 20, idle_nudge_min: 4, max_resumes_per_hour: 3,
    stop_hook_block_cap: 200, auto_switch_account: false, ...(prev.autopilot || {}) },
  budget: { max_parallel_workers: num(env.MAX_PARALLEL_WORKERS, 2), usage_soft_limit: num(env.USAGE_SOFT_LIMIT, 85), usage_hard_limit: num(env.USAGE_HARD_LIMIT, 95) },
  review: { min_recommendation: 'weak accept', benchmark_max_rank: 3, benchmark_papers: 5, benchmark_runs: 2, max_review_rounds: 15, stall_rounds: 3, ...(prev.review || {}) },
};
fs.writeFileSync(cfgFile, JSON.stringify(cfg, null, 2) + '\n');
fs.mkdirSync(root, { recursive: true });
console.log(`[harness] installed: ${harness}`);
console.log(`[harness] projects:  ${root}`);
console.log(`[harness] hub CLI:   ${ccd || '(not found: set CCD_JS or reinstall from the hub)'}`);
console.log('[harness] restart the hub once so its research view uses this harness');
