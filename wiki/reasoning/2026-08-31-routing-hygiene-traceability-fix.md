---
date: 2026-08-31
source: agent
topics: testing-strategy, onboarding-flow
decisions:
status: historical
supersedes:
tags:
summary: CI traceability failure on RIG-151/RIG-152 — Acceptance bullets lacked evidence references; rewritten with test titles and one manual spot-check; check-ticket-traceability.js and full npm test gate green.
---

# CI fix: RIG-151/RIG-152 acceptance traceability (PR #135)

Follow-up after the hygiene bundle landed on `RIG-151-router-hygiene`. CI
failed in `tests/ticket-traceability.test.js` with:

- `RIG-152: acceptance bullet has no evidence reference`
- `manual evidence: 14` (count below the checker’s expected floor)

## Root cause

`scripts/check-ticket-traceability.js` requires every bullet in a Done
ticket’s `## Acceptance` section to end with either:

- `→ tests/<file>::<title>`, or
- `→ manual: <reason>`

The `## Acceptance` sections in [[RIG-151]] (four prose bullets) and
[[RIG-152]] (three bullets, one strikethrough) had no evidence references —
prose only. The hygiene oracle tests were green; the ticket docs did not
satisfy the RIG-131 traceability gate.

## Fix

Rewrote `## Acceptance` in both ticket files:

- **RIG-151** — two bullets: one with the exact hygiene-oracle test title,
  one with `→ manual: rig-grilling hedge-pattern spot-check, 2026-08-31`.
- **RIG-152** — one bullet with the direct test reference; dev-checkout
  constraint folded into the prose; superseded strikethrough removed.

No change to `tests/installed-router-hygiene.test.js` — the failure was in
oracle docs, not test code.

## Verification

- `node scripts/check-ticket-traceability.js` — exit 0, `manual evidence: 15`
  (was 14).
- `npm test` — full gate green, exit 0.
