---
status: draft
---

# Lint-format — from current state to production

> **This file is a map for one catalogue leaf, not a rulebook.** The two
> documents that actually decide anything are
> [`gate1/acceptance.md`](../gate1/acceptance.md) and
> [`gate2/technical-spec.md`](../gate2/technical-spec.md). If this file
> disagrees with either, they are right and this file is wrong.

Checked against the files on **2026-08-21**.

---

## The short version

`development.code-quality.lint-format` is the **one** catalogue leaf (of 115)
with real, service-specific content. It started as a **pre-freeze design
probe** — the intent owner's agreed test of "author one real leaf first, let it
force spec contradictions out" — and it did that job: probing this leaf's
install path found the `AT-INSTALL-1` rollback-vs-resume contradiction live in
running code, and that is now fixed in both Gate 2's text and `rig/lib/apply.js`.

The intent owner selected **lint-format first**, as a production release of
normal Rig with the default-on safety baseline and full 19-host/six-provider
coverage. Gate 2 records that path. It is not authoritative yet: frozen Gate 1
still says all 115 leaves are release-blocking, and Gate 2 cannot narrow Gate 1.
**All twenty lint-format product decisions are now closed**; the remaining work
is authoring the acceptance and re-freezing Gate 1 before this roadmap can
become an implementation plan. [Production context](../reasoning/2026-08-20-lint-format-production-context.md)
[Grilling audit](../reasoning/2026-08-20-lint-format-production-grilling-audit.md)
[Release-contract reconciliation](../reasoning/2026-08-20-lint-format-grilling-release-contract.md)
[Active grilling handoff](lint-format-grilling-handoff.md)

---

## Where lint-format is right now

| Thing | State |
|---|---|
| Catalogue entry (`identity.md`, `minimal.md`, `mid.md`, `maximal.md`, `slices/{floor,property-floor,behavior-oracle}.md`) | **Authored**, service-specific — not template filler. See [the vertical-slice design](lint-format-vertical-slice.md). |
| Check discovery/binding | **Prototype implemented** across `rig/lib/catalog.js`, `plan.js`, `apply.js`, `checks.js`, `ci-adapters.js`, but it recognizes only fixed npm script names. The production contract now requires whole-repository, open-ecosystem semantic discovery; this implementation is not sufficient. |
| Grade model | **Prototype superseded.** The formatter-only → formatter-plus-linter → CI-plus-fix split is not the production contract. The universal model is cumulative Policy → Context → Evidence, applied within each service's owned domain, with ordinary formatter/linter output treated as a commodity input. Current specification remains focused only on this leaf. |
| Applicability | **Intent frozen, acceptance not yet authored.** Rig may install covered components while explicitly reporting user-approved uncovered components as unprotected. Partial installation suppresses any whole-repository support claim. |
| Execution consent | **Intent frozen, acceptance not yet authored.** Service selection authorizes nothing to run. Approval of the concrete plan authorizes its listed read-only commands and scopes; mutating fixes require separate approval. |
| Shell trust | **Intent frozen, acceptance not yet authored.** Repository tasks remain untrusted code under Rig policy, privilege, secret, network, and resource/time controls. `shell: false` protects only the outer argv boundary. |
| `.rig/service-bindings.json` + `.rig/bin/check.js` writing | **Implemented.** Argv arrays only, `shell: false`; the recorded `fix` command is never dispatched by a check. |
| Manifest/resume mechanics this leaf's apply path exercises | **Minimal version implemented** in `rig/lib/apply.js` (`.rig/install-manifest.jsonl`, write-record-then-mutate, `applied` supersede with digest). **Not** the full §7.6 contract — no `complete: false` header field (the incomplete signal is currently receipt-absence, reused from the pre-existing pattern), no preimage content-addressed storage, and no reverse-walk removal. Those remain the Slice 6/Slice 12 lifecycle work. |
| Tests | `tests/advanced-lint-format.test.js` and `tests/advanced-apply.test.js` assert real behavior (reject placeholder content, exercise real formatter/linter/CI commands, exercise the manifest/resume path) — not placeholder presence. |
| Authored-service gate (`AT-SHAPE-6`: mechanical + fresh-context semantic/MECE review) | **Not passed.** The gate itself does not exist yet (Slice 2), and no fresh exact-digest lint-format leaf review receipt exists. |
| Other 114 leaves | **Still placeholders.** 428 `TODO(Slice 10)` files remain. Gate 2 proposes that they block only their own support and the complete-catalogue claim; frozen Gate 1 still makes them release-blocking. |

---

## What has to happen before lint-format is a production leaf

1. **Author the lint-format acceptance and re-freeze Gate 1.** All twenty
   product decisions are closed; follow the two-stage
   [acceptance-authoring handoff](lint-format-grilling-handoff.md) to author
   observable examples and runnable `AT-LF-*` case specs, then land them as one
   amendment. [Grilling audit](../reasoning/2026-08-20-lint-format-production-grilling-audit.md)
2. **Reconcile Gate 1 and Gate 2.** If lint-format may ship first, amend and
   re-freeze Gate 1 before revising Gate 2 to match. No production code work
   starts while they disagree.
3. **Freeze Gate 2.** Resolve the 3 remaining round-3 findings (`AD-30`/§8.4 vs
   D19, §1/`AT-BASE-2` vs §11.1/AD-26, §8.8 vs `AT-SECRET-1`), run a fresh
   review at the final digest, and mark Gate 2 `FROZEN`. [Status](../status.md#ordered-next-steps)
4. **Arm Gate 1 integrity.** The intent owner signs Gate 1 once the verifier
   exists; this is not delegable.
5. **Build the executable specification gate.** `scripts/check-advanced-spec.js`
   and `npm run test:code` must exist so production checks do not rely on the
   currently misleading green suite.
6. **Build the authored-service gate for this leaf.** Lint-format's focused test
   evidence must be judged by the real mechanical anti-filler checks plus a
   fresh exact-digest semantic/MECE leaf review.
7. **Complete §7.6 for lint-format's write path.** The current manifest/resume
   mechanics are a reduced probe; production still needs the `complete: false`
   header, preimage content-addressed storage, and reverse-walk removal path.
8. **Prove distribution.** Add the root `install.sh`, move the package to
   `5.0.0`, and prove a released-tag install into a fresh repository.
9. **Run the production evidence set.** Focused lint-format checks, the
   authored-service gate, distribution proof, and the full production gate must
   pass at the bytes being claimed.

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
- **`rig/lib/apply.js`'s current manifest is not §7.6-complete.** No
  `complete: false` header field exists today — the incomplete signal is
  still "no final receipt was written," reused from the pattern that existed
  before this probe. Do not assume a partial install here already satisfies
  the full `§7.6` contract.
- **Gate 2 cannot narrow Gate 1.** `AD-31` proposes removing the other 114
  leaves as blockers for this support claim, but frozen Gate 1 still says all
  115 are release-blocking. Resolve that in grilling before implementation.

---

## Keeping this file honest

Time-sensitive like [status](../status.md) — rewrite it in place as this
leaf's state changes, do not append revision notes. Anything dated belongs in
[`reasoning/`](../reasoning/) instead, cited from here.
