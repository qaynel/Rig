---
date: 2026-08-19
source: agent
topics: what-rig-is, the-two-gates, delivery-plan
decisions:
---

Design below. I've stopped short of creating anything — nothing is written until you say go.

## 1. Where it lives

`wiki/` at the repo root. `project-dev-docs/` stops existing; every file moves with `git mv` so history follows. The three digest-pinned files move byte-identical, and I verify with `shasum -a 256` after the move that all three hashes still match the values in the handoff table.

## 2. The tree

```
wiki/
  Home.md              — the one page you land on; routes to everything
  status.md            — live state: gate standing, digests, freeze blockers
  glossary.md          — every term of art, defined once

  topics/              — 26 hubs, the heart of it
    the-two-gates            catalogue-contract         host-and-ci-coverage
    what-rig-is              authored-service-gate      trust-and-failure-boundaries
    the-catalogue            policy-model               services-and-reports
    safety-baseline          user-presence-approvals    git-ci-dispatch-evidence
    onboarding-flow          graft-mechanics            drift-and-secret-controls
    gate1-signing            install-manifest-removal   sanitation-and-remediation
    policy-signer-recovery   user-global-writes         distribution-install-stub
    review-receipts          testing-strategy           compatibility-release-gate
    the-specification-gate   delivery-plan

  index/
    decisions.md       — all 129 IDs (G, GA, D, AD), one line each
    acceptance-cases.md— every AT case, its hub, its Gate-2 trace
    rejected.md        — everything considered and turned down, consolidated
    traps.md           — the hard-won lessons, currently buried in §7 of handoff
    timeline.md        — how the design moved, by date

  gate1/               — business-spec.md, acceptance.md (frozen, untouched)
  gate2/               — technical-spec.md
  specs/               — product-spec, host-coverage-spec, sow, tasklist, roadmap
  sources/
    logs/              — advanced-grilling.md, grill-decisions.md, verbatim
    reference/         — the six captured .raw.md files
    reviews/           — receipts
    superseded/        — the old archive/ material
  reasoning/           — where your traces land
```

## 3. What a hub actually contains

Six fixed parts, so every hub reads the same way: **what it is** in a paragraph → **why it's this way** → **what binds it** (the decision IDs, linked) → **what was rejected and why** → **where the authoritative text lives** → **what's still open**. Every factual claim carries its citation inline, so any line can be checked against the source in one click. Hubs never restate frozen text; they point at it.

## 4. How your reasoning traces get filed

You paste a trace; it lands at `wiki/reasoning/YYYY-MM-DD-<slug>.md` **verbatim, never edited**. Above it, four lines: date, who, which hubs it touches, which decision IDs it creates or changes. Then I update those hubs and the decision index to cite it.

The split matters: the trace is the record and is immutable, the hub is the synthesis and is rewritten freely. That's what stops a wiki rotting into contradictions with its own history.

I'd add one line to `CLAUDE.md` making this a standing rule, so every agent files traces this way and not just me in this session.

## 5. What else has to change

Moving the directory breaks references in eleven places: the three READMEs, `AGENTS.md`, and `GEMINI.md`. `AGENTS.md` is the catch — its body is mirrored into six host copies and `scripts/check-rule-copies.js` enforces byte-equality, so that edit means regenerating all six. `npm test` has to be green before any of this is pushed. Nothing in `scripts/` or `package.json` hardcodes these paths, so no code depends on the move.

## 6. Something the survey turned up

Gate 1 currently defines four acceptance cases that Gate 2's traceability table doesn't cover: `AT-CLAIM-2`, `AT-CLAIM-3`, `AT-HOST-3`, `AT-HOST-4`. The handoff requires that table to match Gate 1 exactly, and it doesn't — the two commits since (`13a2ad6`, `b26b7e7`) amended Gate 1 and Gate 2 separately. The counts are in flux, and the "52 cases" figure in the handoff is from 2026-07-28 and is now stale.

I'm flagging it, not fixing it — that's Gate 2 work and it isn't mine to touch. But it's a good sign the wiki is worth building: `index/acceptance-cases.md` makes exactly this kind of gap visible on one page instead of requiring two greps and a diff.

## 7. Order

Move and verify digests → write the 26 hubs → build the five indexes → Home, status, glossary → fix the eleven references and regenerate the host copies → `npm test`.

The hubs are the bulk of the work and where I can be wrong, since they're synthesis rather than transcription. I'll do them in dependency order so the early ones establish vocabulary the later ones reuse.

**One last thing before I start:** this design document is itself a reasoning trace. I'd rather file it as `wiki/reasoning/2026-08-19-wiki-design.md` — the first entry, dogfooding the convention — than leave a spec file in a separate directory that then needs its own home after the rewrite. Say the word and I'll begin.

## Approval

Intent owner, verbatim: "Yup looks good"
