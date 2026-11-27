# Autonomous Research (research harness)

The harness behind the hub's **Research** view. You give an initial research direction; a **director** Claude Code
session runs the loop *idea → target venue → literature/SOTA → plan → experiments → analysis → re-run/re-plan →
paper → self-review* on its own, manages worker sessions, and answers your messages between turns.

## What gets installed

| part | where | what it does |
|---|---|---|
| `harness/template/` | harness folder | `CLAUDE.md` operating manual + project hooks copied into every new project |
| `harness/hooks/` | harness folder | Stop hook (keeps the director going), session-start (state summary), stop-failure (usage limit → wait) |
| `harness/lib/` | harness folder | project scaffold / registry, P9 review gate |
| `harness/tools/` | harness folder | citation check (Crossref / arXiv / Semantic Scholar), external review and venue benchmark through `ccd gpt` |
| `harness/config.json` | harness folder | autopilot limits and budget, written from the install settings; outside the agent's reach |
| `plugin/` → `hub/local/plugins/research-harness/` | hub | tells the hub where the harness is (`provides.researchHarness`) |

The research view, the watchdog (idle nudge, wake-ups, resume after a crash) and the director/worker launch are part of
the hub itself; this app supplies the harness they drive.

## Settings

- **Research projects folder** (required) — each project becomes `<folder>/<slug>/` with its own git repo.
- **Harness folder** — default: inside the app folder. Another folder must be empty (or one this app installed).
- **Skills folder** — where the `paper-*` review skills are (default `~/.claude/skills`).
- **Machine rules file** — Markdown inserted into each project's CLAUDE.md (GPU queue, disks, network). Without it,
  `local-env.example.md` is used; edit `local-env.md` in the harness folder later if you like.
- Worker count and usage limits.

After installing, **restart the hub once**. If the hub's `config.json` has `"researchHarness"` (or the env
`CCD_HARNESS` is set), that wins; remove it to use this app. *Check installation* shows what the hub will use.

Uninstalling removes the app folder and a harness folder it installed elsewhere. **Research projects are never
deleted**, but projects created with this harness reference its hooks; reinstall to the same folder to resume them.

## Cautions

- A full research run uses many turns, subagents and workers: watch the usage meters.
- Results and papers still need human review. By default nothing is submitted, posted or pushed anywhere.
- The director starts Claude Code with skipped permission prompts inside the project folder; keep the projects folder
  away from data you do not want an agent to modify.

## Gates

`harness/GATES.md` holds the research gates every new topic must pass (question first, independent ground truth,
baselines before the method, a short pilot with a pre-set effect size, bounded formal reviews, explicit stopping).

## Compatibility

An add-on for CCD (Agent CLI Hub). Requires CCD `>=1.0.0` with the App Store and Plugin API v1 (`requires` in `app.json`).
Tested on 2026-11-27 against agent-cli-hub `dev_side` 667a68f (CCD 1.0.0) with the App Store / Plugin API v1 changes: install, setup, run, open in the hub, update, uninstall.

## License

MIT (see LICENSE).
