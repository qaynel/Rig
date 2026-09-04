---
date: 2026-09-05
source: agent
topics: the-overhaul, agent-working-conventions
decisions:
status: current
supersedes:
tags: review, verification
summary: Merge-scoped acceptance criteria for PR #146 — eight observable wiki/docs checks, not Gate 1 AT-* cases; all eight pass against HEAD after the hub-sync; the four workflow-fix slices and any oracle edit remain out of scope.
---

# Acceptance criteria — PR #146

This PR files a wiki restore and a design. It does not change product
behavior. The criteria below are the merge contract. They are **not** Gate 1
`AT-*` cases and do not belong in the signed oracle.

Bound to branch `wiki-2026-09-04-overhaul-and-maintenance` vs `origin/qa-prod`.
Evidence: [[2026-09-04-pr146-test-plan-receipt]] (fail at `b1b5d754`) and
[[2026-09-04-pr146-hub-sync-fix]] (green at `6a1b6803`), plus the independent
re-run recorded on the PR.

## In scope

Restore a usable current-state wiki, keep the frozen oracle untouched, and
file the 2026-09-04 overhaul as design-only.

## Out of scope

- Implementing the four workflow-fix slices.
- Adding, editing, or re-signing any `AT-*` case.
- Editing `wiki/gate1/`.
- Wiring `scripts/check-size-hints.js` into `package.json` `scripts`.

---

## Criteria

### PR146-AC-1 — Current-state trace links resolve at wiki depth

Every markdown link on `wiki/status.md` that points at a reasoning trace uses
the prefix `reasoning/` (not `../reasoning/`) and the target file exists under
`wiki/reasoning/`.

Check: resolve all `wiki/status.md` hrefs from `wiki/`. Generator
`node scripts/build-wiki-index.js` is idempotent against the committed pages.

Verdict: **pass** (21 links, 0 broken, 20 `reasoning/` prefixes).

### PR146-AC-2 — Index trace links still resolve at index depth

Every reasoning-trace href on `wiki/index/reasoning.md` uses `../reasoning/`
and the target file exists.

Check: resolve all `wiki/index/reasoning.md` hrefs from `wiki/index/`.

Verdict: **pass** (190 links, 0 broken, 190 `../reasoning/` prefixes).

### PR146-AC-3 — Current-state is generated from live traces, not a 60-entry dump

`wiki/status.md` is generated. Path B slice, hardening, and closeout traces
that shipped in PR #143 are `status: historical`. The committed generated
pages match a fresh `node scripts/build-wiki-index.js` run.

Check: `tests/wiki-index.test.js` ("committed generated wiki files match
immutable trace frontmatter").

Verdict: **pass**.

### PR146-AC-4 — Frozen oracle and signed package scripts are byte-unchanged

`git diff origin/qa-prod...HEAD -- wiki/gate1/ package.json` is empty.
`package.json` `scripts.test:code` does not mention `check-size-hints.js` and
matches `wiki/gate1/package-scripts.json`. `node scripts/check-advanced-spec.js`
verifies the oracle.

Verdict: **pass** (oracle: 16 files, 95 cases).

### PR146-AC-5 — Dated reasoning-trace bodies are unchanged

For every pre-existing dated file under `wiki/reasoning/` that this PR
modifies, the body after the closing frontmatter `---` is byte-identical to
`origin/qa-prod`. Frontmatter may change (`status`, `summary`). `README.md` is
the convention page, not a dated trace, and is out of this criterion.

Check: split-frontmatter equality over `git diff --name-status
origin/qa-prod...HEAD -- wiki/reasoning/`.

Verdict: **pass** (39 dated traces frontmatter-only).

### PR146-AC-6 — Full CI gate is green, including wiki-maintenance lint

`npm test` exits 0. `lintFindings` is empty: every hub named in a post-floor
trace's `topics:` is at least as new as that trace.

Check: `npm test`; `tests/wiki-maintenance-lint.test.js`.

Verdict: **pass** at `6a1b6803` (721 pass / 0 fail / 1 skip; pi-extension 15;
rig-mcp 6). Failed at `b1b5d754` on five stale hubs; closed by
[[2026-09-04-pr146-hub-sync-fix]].

### PR146-AC-7 — The overhaul is filed, not shipped

`wiki/topics/the-overhaul.md` exists and states that nothing in the workstream
is implemented. `git diff origin/qa-prod...HEAD -- rig/` is empty.

Verdict: **pass**.

### PR146-AC-8 — Bounded navigation exists and does not expand the signed gate

`wiki/index/quick-reference.md` exists, is ≤150 lines, and is linked from
`wiki/Home.md` and `wiki/agent-primer.md`. `scripts/check-size-hints.js`
exists and is not in `package.json` `scripts`.

Verdict: **pass** (92 lines; linked from both entrypoints). Line-count
accuracy on that page is **not** this criterion — the checker is standalone
on purpose. Residual: `node scripts/check-size-hints.js` currently reports
stale counts; `--fix` is cleanup, not a merge gate.

---

## Mapping to the PR test plan

| Test-plan item | Criteria |
|---|---|
| `npm test` stays green; do not wire the size-hint checker into `package.json` | PR146-AC-4, PR146-AC-6, PR146-AC-8 |
| `wiki/status.md` links resolve under `wiki/reasoning/` | PR146-AC-1, PR146-AC-3 |
| `wiki/index/reasoning.md` `../reasoning/` links still resolve | PR146-AC-2 |
| Skim the overhaul hub and the quick reference | PR146-AC-7, PR146-AC-8 |
| Reasoning-trace diffs frontmatter-only; `wiki/gate1/` not edited | PR146-AC-4, PR146-AC-5 |
