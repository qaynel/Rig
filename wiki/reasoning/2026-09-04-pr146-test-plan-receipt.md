---
date: 2026-09-04
source: review
topics: agent-working-conventions
decisions:
status: historical
supersedes:
tags: review, verification
summary: Report-only acceptance receipt for PR #146 at b1b5d754 against its five-item test plan — overall fail at that commit; superseded by the hub-sync fix, which made npm test green.
---

# Acceptance receipt — PR #146 test plan

Report-only. Reviewed commit `b1b5d75434531630454ee6efe08b4662c0fadd5c`
(`wiki-2026-09-04-overhaul-and-maintenance`) against base `origin/qa-prod`
`d834e1edd515d9298e3834aa7c8765080da6c018`. PR
https://github.com/qaynel/Rig/pull/146. Ran 2026-09-04 21:09 IST.

This trace and a citation on the agent-working-conventions hub are the only
worktree edits from this review. No test-plan item was "fixed" here.

**Overall verdict: fail.** Do not merge until item 1 is green.

---

## Item 1 — `npm test` stays green; do not add `check-size-hints.js` to `package.json` without a Gate 1 re-sign

**Verdict: fail** on the green-suite half. The freeze half holds.

### Suite

`npm test` exit 1 in 79s.

- `scripts/check-advanced-spec.js` — pass: `Gate 1 protected:
  principal=gate1-owner fingerprint=SHA256:0Ok+jnRuyWIZdLUPt3ZtN4StHaDIsVtVM24A12zajRY`.
  `Oracle verified: 16 files, 95 acceptance cases`.
- `tests/*.test.js` — 722 tests, 720 pass, 1 fail, 1 skip
  (`PR_SET_PDEATHSIG` is Linux-only).
- `pi-extension` and `rig-mcp` suites — not reached; `test:code` is chained
  with `&&`.

Failing test: `tests/wiki-maintenance-lint.test.js:12`
`wiki-maintenance lint is clean on the current branch`.

`lintFindings` reported five stale hubs — each older than the newest
post-floor trace whose `topics:` names it (`scripts/wiki-maintenance.js`
`staleHubs`). Newest citing traces are the 2026-09-04 files added in this PR,
git date `2026-09-04T20:57:17+05:30`:

| Hub | Hub last commit | Named in |
|---|---|---|
| `wiki/topics/distribution-and-release.md` | 2026-09-01T06:42:13+05:30 | `2026-09-04-finished-product-design`, `2026-09-04-landscape-research-in-flight` |
| `wiki/topics/onboarding-flow.md` | 2026-09-03T18:01:34+05:30 | `2026-09-04-finished-product-design` |
| `wiki/topics/testing-strategy.md` | 2026-09-03T18:01:34+05:30 | `2026-09-04-structural-workflow-fix-design`, `2026-09-04-landscape-research-in-flight` |
| `wiki/topics/the-catalogue.md` | 2026-09-02T01:33:52+05:30 | `2026-09-04-finished-product-design` |
| `wiki/topics/the-two-gates.md` | 2026-09-03T08:39:19+05:30 | `2026-09-04-structural-workflow-fix-design` |

Hubs that *were* updated in the same commit (`agent-working-conventions`,
`gate1-signing`, `what-rig-is`, `the-overhaul`) share the traces' git date
and do not fail this check.

This is the filing rule in `wiki/reasoning/README.md` ("After filing": update
every hub named in `topics:`) firing as a test, not a style nit.
[[2026-09-04-wiki-maintenance-sweep]] §6 recorded "No topic hub was rewritten"
as a deliberate sweep choice; that choice is what made the lint red once the
new traces named those hubs.

The sweep's own claim that "`npm test` [was] green throughout" / "exit code 0
after the generator change" is not true of this combined PR at `b1b5d754`.
Trace bodies are immutable, so that sentence stays; this receipt is the
correction.

### `package.json` freeze

Pass. `git diff origin/qa-prod...HEAD -- package.json wiki/gate1/package-scripts.json`
is empty. `package.json` `scripts.test:code` does not mention
`check-size-hints.js`. It is byte-identical to `wiki/gate1/package-scripts.json`
`test:code`. That is why the oracle still verifies — the break-and-revert
recorded in [[2026-09-04-gate1-package-scripts-break-and-revert.md]] held.

The checker still exists standalone. Running it against the committed
quick-reference is already red (four stale counts). That is not an `npm test`
failure, because the script is not in the gated suite. Recorded under
residual findings.

---

## Item 2 — Open `wiki/status.md` and confirm trace links resolve under `wiki/reasoning/`

**Verdict: pass.**

21 markdown links on `wiki/status.md`, 0 broken. Every reasoning-trace href
uses the `reasoning/` prefix (20 of them), which from `wiki/` resolves to
`wiki/reasoning/<file>`. Spot-checked: the first current entry
`reasoning/2026-09-04-wiki-maintenance-sweep.md` exists on disk.

This is the defect [[2026-09-04-wiki-maintenance-sweep]] §1 named: the
generator's `link()` helper previously hardcoded `../reasoning/`, which is
correct for `wiki/index/reasoning.md` and wrong for `wiki/status.md`.
`scripts/build-wiki-index.js` now takes the prefix from the caller.
Re-running the generator at review time produced an empty diff against the
committed generated pages.

---

## Item 3 — Open `wiki/index/reasoning.md` and confirm its `../reasoning/` links still resolve

**Verdict: pass.**

190 markdown links on `wiki/index/reasoning.md`, 0 broken. Every
reasoning-trace href uses `../reasoning/` (190 of them), which from
`wiki/index/` resolves to `wiki/reasoning/<file>`. The prefix split between
the two generated pages is the load-bearing part of the §1 fix; both sides
hold.

---

## Item 4 — Skim `wiki/topics/the-overhaul.md` and `wiki/index/quick-reference.md` as the two new entry points

**Verdict: pass**, with residual size-hint rot on the quick reference.

### `wiki/topics/the-overhaul.md` (267 lines, 20 links, 0 broken)

Does the job the primer and Home now assign it: one page for the 2026-09
workstream. States up front that nothing in it is implemented. Holds the
diagnosis (mandatory write / advisory unbounded read), the four-slice
workflow fix, the recommended #1/#2 swap, the architecture deletion findings,
the rejected options, and the five human decisions that gate further work.
Every major claim cites a 2026-09-04 trace. Related-hub links at the bottom
are live.

### `wiki/index/quick-reference.md` (92 lines, under the 150-line cap; 33 links, 0 broken)

Task-routed, not date-routed. Line counts sit beside links as advertised.
The page itself is the bounded middle the workflow-fix design asked for, and
it says it is navigation rather than enforcement.

`node scripts/check-size-hints.js` against the committed page:

```
wiki/index/quick-reference.md:21 rejected.md: says 100, actually 116
wiki/index/quick-reference.md:31 ../topics/gate1-signing.md: says 229, actually 240
wiki/index/quick-reference.md:34 ../topics/agent-working-conventions.md: says 150, actually 156
wiki/index/quick-reference.md:42 ../status.md: says 27, actually 28
```

All four targets moved in this same PR (rejected-index rows, hub edits,
generated status). The checker was added so these numbers cannot rot; they
already have, because `--fix` was not run before commit. Not a merge blocker
on its own — the script is not in the gated suite — but it is the page's
entire stated value drifting on day one.

---

## Item 5 — Confirm reasoning-trace diffs are frontmatter-only (bodies unchanged). Frozen `wiki/gate1/` links were recorded, not edited

**Verdict: pass.**

`git diff --name-status origin/qa-prod...HEAD -- wiki/reasoning/`:

- 6 new dated traces (2026-09-04-*). Bodies are new by construction.
- 39 modified dated traces: body after closing frontmatter `---` is
  byte-identical to `origin/qa-prod` on every one. Frontmatter keys that
  moved: `status` on 38 (current → historical, the lifecycle sweep),
  `summary` on 1 (`2026-08-31-path-b-follow-up-decisions`).
- 1 modified non-trace file: `wiki/reasoning/README.md`. Body changed: the
  `summary:` field convention now requires a one-line summary regardless of
  `status:`. That is the convention page, not a dated trace, and it matches
  [[2026-09-04-wiki-maintenance-sweep]] §2. Out of item-5 scope.

`git diff --stat origin/qa-prod...HEAD -- wiki/gate1/` is empty. Frozen
internal links inside `wiki/gate1/` were recorded in the sweep (§4) and left
untouched.

---

## Residual findings (not test-plan items)

1. **Size-hint checker already red** on the committed quick-reference (item 4).
   Fix is `node scripts/check-size-hints.js --fix`. Do not wire it into
   `package.json` without a re-sign.
2. **`pi-extension` / `rig-mcp` not observed.** Re-run `npm test` after item 1
   is green; they sit behind the failing Node suite.

---

## What would make this a pass

Update the five stale hubs so each reflects — even in one citing sentence —
the 2026-09-04 traces that already name them in `topics:`, then confirm
`npm test` exit 0. That is the same "After filing" follow-up
`wiki/reasoning/README.md` already requires. Narrowing `topics:` instead
would also go green and would hide the obligation.

Do not treat the size-hint `--fix` as a substitute for the hub updates; it
does not touch `staleHubs`.
