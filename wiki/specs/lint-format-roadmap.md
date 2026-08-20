---
status: draft
---

# Lint-format — from current state to production

> **This file is a map for one catalogue leaf, not a rulebook.** The two
> documents that actually decide anything are
> [`gate1/acceptance.md`](../gate1/acceptance.md) and
> [`gate2/technical-spec.md`](../gate2/technical-spec.md). If this file
> disagrees with either, they are right and this file is wrong.

Checked against the files on **2026-08-20**.

---

## The short version

`development.code-quality.lint-format` is the **one** catalogue leaf (of 115)
with real, service-specific content. It exists as a **pre-freeze design
probe** — the intent owner's agreed test of "author one real leaf first, let
it force spec contradictions out" — not as production authorship. It did its
job: probing this leaf's install path found the `AT-INSTALL-1`
rollback-vs-resume contradiction live in running code, and that is now fixed
in both Gate 2's text and `rig/lib/apply.js`.

**Nothing about this leaf is shippable on its own.** Gate 2 builds the whole
catalogue through one ordered 15-slice plan; a single leaf cannot exit ahead
of it. This file tracks what is already true for lint-format specifically and
what the same ordered plan still requires before it counts as a production
leaf.

---

## Where lint-format is right now

| Thing | State |
|---|---|
| Catalogue entry (`identity.md`, `minimal.md`, `mid.md`, `maximal.md`, `slices/{floor,property-floor,behavior-oracle}.md`) | **Authored**, service-specific — not template filler. See [the vertical-slice design](lint-format-vertical-slice.md). |
| Check discovery/binding (`format:check` minimal, `+lint` mid, `+format`/`lint:fix`/CI maximal) | **Implemented** across `rig/lib/catalog.js`, `plan.js`, `apply.js`, `checks.js`, `ci-adapters.js`. |
| `.rig/service-bindings.json` + `.rig/bin/check.js` writing | **Implemented.** Argv arrays only, `shell: false`; the recorded `fix` command is never dispatched by a check. |
| Manifest/resume mechanics this leaf's apply path exercises | **Minimal version implemented** in `rig/lib/apply.js` (`.rig/install-manifest.jsonl`, write-record-then-mutate, `applied` supersede with digest). **Not** Slice 6's full §7.6 contract — no `complete: false` header field (the incomplete signal is currently receipt-absence, reused from the pre-existing pattern), no preimage CAS, no sanitation-control rollback. Those remain Slice 6's job. |
| Tests | `tests/advanced-lint-format.test.js` and `tests/advanced-apply.test.js` assert real behavior (reject placeholder content, exercise real formatter/linter/CI commands, exercise the manifest/resume path) — not placeholder presence. |
| Authored-service gate (`AT-SHAPE-6`: mechanical + fresh-context semantic/MECE review) | **Not passed.** The gate itself does not exist yet (Slice 2), and only this one leaf has content to check anyway. |
| Formal Slice 14 authorship (all 115 leaves, one at a time, single context) | **Not started.** This probe predates Slice 14 and does not substitute for it — see [the authored-service gate](../topics/authored-service-gate.md). |

---

## What has to happen, in order, before lint-format is a production leaf

Gate 2 has no per-leaf fast path: every leaf, including this one, rides the
same ordered plan. Steps 1–4 are whole-project prerequisites already tracked
in [status](../status.md#ordered-next-steps); steps 5–9 are where this leaf's
own content gets used or re-verified.

1. **Resolve the 3 remaining round-3 Gate 2 findings** (`AD-30`/§8.4 vs D19,
   §1/`AT-BASE-2` vs §11.1/AD-26, §8.8 vs `AT-SECRET-1`). None of them concern
   lint-format's own design. [Status](../status.md#the-blocker-round-3-failed--one-finding-now-resolved-in-candidate-text)
2. **Fresh round-4 review** at the new digest.
3. **The intent owner signs Gate 1** — not delegable.
4. **Gate 2 marked `FROZEN`.**
5. **Slice 1** — the specification gate and `npm run test:code` start
   existing. Lint-format's tests keep passing under it; nothing about the
   leaf changes here.
6. **Slice 2** — the authored-service gate becomes real. This is the first
   point where lint-format's current content runs through an actual gate
   (mechanical inventory + anti-filler checks) instead of only its own
   focused test file.
7. **Slice 6** — the formal `§7.6` manifest writer lands (`complete: false`
   header, preimage CAS, sanitation-control wiring/unwiring). It **supersedes**
   the minimal pre-freeze implementation this leaf's apply path currently
   exercises; lint-format's install/resume behavior gets re-verified against
   the complete contract, not just the reduced one the probe built.
8. **Slice 14** — lint-format is (re-)authored in its turn as one of 115
   leaves, in the same single-context, one-at-a-time order as every other
   leaf, and passes the fresh exact-digest semantic/MECE review as part of
   the whole set. **The pre-freeze content is a head start, not a pass** —
   see the same caveat in [the authored-service gate](../topics/authored-service-gate.md#what-is-still-open).
9. **Slice 15** — the complete matrix and fresh specification review run
   over the whole catalogue, lint-format included, before anything is
   `FROZEN` as done.

On top of all nine: the product-level release blockers (`install.sh`,
version `5.0.0`, deleting `.github/workflows/publish.yml`) gate whether the
*product* ships at all. Lint-format cannot be "in production" before that,
regardless of its own state. See [the delivery plan](../topics/delivery-plan.md).

---

## What the probe already de-risked

- The `AT-INSTALL-1` rollback-vs-resume contradiction the round-3 review
  flagged was confirmed live in running code by probing this leaf's own
  install path (a deliberate mid-apply interrupt), and is now fixed in both
  Gate 2's text and `rig/lib/apply.js`. [Resolution trace](../reasoning/2026-08-20-resolve-at-install-1.md)
- The discovery-first check/binding shape (read repo-owned commands, name
  missing ones as coverage gaps, keep checks and CI read-only, keep autofix
  explicit-only) held up under real formatter/linter commands and a real
  interrupted-apply case, which is evidence for the shared archetype
  (`AT-SHAPE-1`–`4`) the other 114 leaves will reuse — but evidence from one
  leaf, not proof for 115.

---

## Traps specific to this leaf

- **A focused test passing is not the authored-service gate passing.** The
  gate doesn't exist yet (Slice 2). `tests/advanced-lint-format.test.js`
  proves this leaf isn't placeholder content; it does not prove it would
  survive the real gate. [The suite is green and means nothing](../index/traps.md#the-suite-is-green-and-means-nothing)
- **`rig/lib/apply.js`'s current manifest is not Slice 6-complete.** No
  `complete: false` header field exists today — the incomplete signal is
  still "no final receipt was written," reused from the pattern that existed
  before this probe. Do not assume a partial install here already satisfies
  the full `§7.6` contract.
- **This leaf cannot freeze Gate 2 by itself.** Three round-3 findings are
  still open and none of them are about lint-format — do not read this
  leaf's progress as progress toward the freeze.

---

## Keeping this file honest

Time-sensitive like [status](../status.md) — rewrite it in place as this
leaf's state changes, do not append revision notes. Anything dated belongs in
[`reasoning/`](../reasoning/) instead, cited from here.
